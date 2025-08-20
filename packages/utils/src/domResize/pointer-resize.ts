import type { ResizeData, ResizingFn } from './core';
import { resizeByDirection, updateResize } from './core';

export function resizeByPointer(resizeData: ResizeData) {
  if (!resizeData.options.event) {
    return;
  }
  resizeByDirection(resizeData, resizeHorizontal, resizeVertical, resizeHorizontalAndVertical);
}

/** 调整水平方向 */
function resizeHorizontal(resizeData: ResizeData, resizingWidthFn: ResizingFn) {
  const { setStyleWidthOrHeight, setStyleOffset, moveDistance } = resizeData;
  const { offsetY: domOffsetY, pointerDir } = resizeData.domAttrs;
  beginResizeContent(resizeData, ({ startX, endX }) => {
    const { value: width, offset: offsetX, otherOffset: otherOffsetY } = resizingWidthFn(startX, endX, 'x', pointerDir.x);
    if (!moveDistance.x) { return; }
    const offsetY = domOffsetY + otherOffsetY;
    const widthStyle = setStyleWidthOrHeight(width, 'width');
    const offsetStyle = setStyleOffset(offsetX, offsetY);
    updateResize(resizeData, { width, offsetX, offsetY }, { ...widthStyle, ...offsetStyle });
  });
}

/** 调整垂直方向 */
function resizeVertical(resizeData: ResizeData, resizingHeightFn: ResizingFn) {
  const { setStyleWidthOrHeight, setStyleOffset, moveDistance } = resizeData;
  const { offsetX: domOffsetX, pointerDir } = resizeData.domAttrs;
  beginResizeContent(resizeData, ({ startY, endY }) => {
    const { value: height, offset: offsetY, otherOffset: otherOffsetX } = resizingHeightFn(startY, endY, 'y', pointerDir.y);
    if (!moveDistance.y) { return; }
    const offsetX = domOffsetX - otherOffsetX;
    const heightStyle = setStyleWidthOrHeight(height, 'height');
    const offsetStyle = setStyleOffset(offsetX, offsetY);
    updateResize(resizeData, { height, offsetX, offsetY }, { ...heightStyle, ...offsetStyle });
  });
}

/** 调整水平与垂直方向 */
function resizeHorizontalAndVertical(resizeData: ResizeData, resizingWidthFn: ResizingFn, resizingHeightFn: ResizingFn) {
  const { setStyleWidthOrHeight, setStyleOffset, moveDistance, options: { lockAspectRatio } } = resizeData;
  const { aspectRatio, pointerDir } = resizeData.domAttrs;
  const updateDom = (coord: { startX: number, startY: number, endX: number, endY: number }) => {
    const { value: width, offset: resizeOffsetX, otherOffset: otherOffsetY } = resizingWidthFn(coord.startX, coord.endX, 'x', pointerDir.x);
    const { value: height, offset: resizeOffsetY, otherOffset: otherOffsetX } = resizingHeightFn(coord.startY, coord.endY, 'y', pointerDir.y);
    if ((!moveDistance.x && !moveDistance.y) // 移动距离为0时，不更新dom
      || (lockAspectRatio && (!moveDistance.x || !moveDistance.y))) { // 锁定比例时，任意一个方向的移动距离为0时，不更新dom
      return;
    }
    const offsetX = resizeOffsetX - otherOffsetX;
    const offsetY = resizeOffsetY + otherOffsetY;
    const widthStyle = setStyleWidthOrHeight(width, 'width');
    const heightStyle = setStyleWidthOrHeight(height, 'height');
    const offsetStyle = setStyleOffset(offsetX, offsetY);
    updateResize(resizeData, { width, height, offsetX, offsetY }, { ...widthStyle, ...heightStyle, ...offsetStyle });
  };

  if (lockAspectRatio) {
    // 固定比例时，宽度根据鼠标位置决定，高度的调整根据宽度的变化与元素宽高比例决定
    // 根据宽高调整的方向处理
    let dir = resizingWidthFn === resizingHeightFn ? 1 : -1;
    const isBothX = !moveDistance.dirX;
    const isBothY = !moveDistance.dirY;
    if (isBothX || isBothY) {
      if (!isBothY) {
        // x轴可以左右移动，但y轴固定方向
        dir = -dir * moveDistance.dirY * pointerDir.x * 2;
      }
      else if (!isBothX) {
        // y轴可以上下移动，但x轴固定方向
        dir = -dir * moveDistance.dirX * pointerDir.y / 2;
      }
      else {
        // x轴和y轴都可以左右上下移动
        dir = pointerDir.x * pointerDir.y;
      }
    }

    beginResizeContent(resizeData, ({ startX, endX }) => {
      const startY = (dir * startX) / aspectRatio;
      const endY = (dir * endX) / aspectRatio;
      updateDom({ startX, startY, endX, endY });
    });
  }
  else {
    // 不固定比例时，宽高根据鼠标位置决定
    beginResizeContent(resizeData, ({ startX, endX, startY, endY }) => {
      updateDom({ startX, startY, endX, endY });
    });
  }
}

/** 当前正在使用的指针id集合 */
const resizePointerIdSet = new Set<number>();

/** 使用指针调整大小 */
function beginResizeContent(
  resizeData: ResizeData,
  moveFn: (coord: { startX: number, endX: number, startY: number, endY: number }) => void,
) {
  const target = resizeData.targetRef.deref();
  if (!target) { return; }
  if (!resizeData.options.event) { return; }
  // 开始
  const pointerId = resizeData.options.event.pointerId;
  if (!resizePointerIdSet.has(pointerId)) {
    resizePointerIdSet.add(pointerId);
    target.setPointerCapture(resizeData.options.event.pointerId);
  }
  // 移动
  const moveHandler = getMoveHandler(resizeData, moveFn);
  target.addEventListener('pointermove', moveHandler);
  // 结束
  const upHandler = (overEvent: PointerEvent) => {
    const targetDeref = resizeData.targetRef.deref();
    targetDeref?.releasePointerCapture(overEvent.pointerId);
    resizePointerIdSet.delete(overEvent.pointerId);
    targetDeref?.removeEventListener('pointermove', moveHandler);
    targetDeref?.removeEventListener('pointerup', upHandler);
    targetDeref?.removeEventListener('pointercancel', upHandler);
  };
  target.addEventListener('pointerup', upHandler);
  target.addEventListener('pointercancel', upHandler);
}

/** 获取移动计算函数 */
function getMoveHandler(
  resizeData: ResizeData,
  moveFn: (coord: { startX: number, endX: number, startY: number, endY: number }) => void,
) {
  const { scaleX, scaleY, rotate } = resizeData.domAttrs.transform;
  // 计算起始点坐标
  const clientX = resizeData.options.event!.clientX;
  const clientY = resizeData.options.event!.clientY;
  if (rotate) {
    // 计算旋转角度（转换为弧度）
    const angleRad = -rotate * Math.PI / 180;
    // 应用逆时针旋转矩阵，然后应用缩放
    const rotatedStartX = clientX * Math.cos(angleRad) - clientY * Math.sin(angleRad);
    const rotatedStartY = clientX * Math.sin(angleRad) + clientY * Math.cos(angleRad);
    const startX = rotatedStartX / scaleX;
    const startY = rotatedStartY / scaleY;
    return (moveEvent: PointerEvent) => {
      // 计算结束点坐标
      const moveX = moveEvent.clientX;
      const moveY = moveEvent.clientY;
      // 应用逆时针旋转矩阵，然后应用缩放
      const rotatedEndX = moveX * Math.cos(angleRad) - moveY * Math.sin(angleRad);
      const rotatedEndY = moveX * Math.sin(angleRad) + moveY * Math.cos(angleRad);
      const endX = rotatedEndX / scaleX;
      const endY = rotatedEndY / scaleY;
      moveFn({ startX, endX, startY, endY });
    };
  }
  else {
    const startX = clientX / scaleX;
    const startY = clientY / scaleY;
    return (moveEvent: PointerEvent) => {
      const endX = moveEvent.clientX / scaleX;
      const endY = moveEvent.clientY / scaleY;
      moveFn({ startX, endX, startY, endY });
    };
  }
}
