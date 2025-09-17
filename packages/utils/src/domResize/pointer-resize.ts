import type { ResizeApplication, ResizingFn } from './resize-core/resize-application';

export function resizeByPointer(resizeApplication: ResizeApplication) {
  if (!resizeApplication.options.pointer) {
    return;
  }
  resizeApplication.resizeByDirection(resizeHorizontal, resizeVertical, resizeHorizontalAndVertical);
}

/** 调整水平方向 */
function resizeHorizontal(resizeApplication: ResizeApplication, resizingWidthFn: ResizingFn) {
  const { resizeDistance, styleUpdater, domAttrs, axisParams } = resizeApplication;
  const { offsetY: domOffsetY, pointerDir } = domAttrs;
  // 延续之前的移动距离
  const dir = axisParams.x.dir || 0.5 * pointerDir.x;
  const distanceX = resizeDistance.x.total;
  beginResizeContent(resizeApplication, ({ startX, endX }) => {
    const { value: width, offset: offsetX, otherOffset: otherOffsetY } = resizingWidthFn(startX, endX + dir * distanceX, 'x', pointerDir.x);
    if (!resizeDistance.x.distance) { return; }
    const offsetY = domOffsetY + otherOffsetY;
    const widthStyle = styleUpdater.setStyleWidthOrHeight(width, 'width');
    const offsetStyle = styleUpdater.setStyleOffset(offsetX, offsetY);
    resizeApplication.updateResize({ width, offsetX, offsetY }, { ...widthStyle, ...offsetStyle });
  });
}

/** 调整垂直方向 */
function resizeVertical(resizeApplication: ResizeApplication, resizingHeightFn: ResizingFn) {
  const { resizeDistance, styleUpdater, domAttrs, axisParams } = resizeApplication;
  const { offsetX: domOffsetX, pointerDir } = domAttrs;
  // 延续之前的移动距离
  const dir = axisParams.y.dir || 0.5 * pointerDir.y;
  const distanceY = resizeDistance.y.total;
  beginResizeContent(resizeApplication, ({ startY, endY }) => {
    const { value: height, offset: offsetY, otherOffset: otherOffsetX } = resizingHeightFn(startY, endY + dir * distanceY, 'y', pointerDir.y);
    if (!resizeDistance.y.distance) { return; }
    const offsetX = domOffsetX - otherOffsetX;
    const heightStyle = styleUpdater.setStyleWidthOrHeight(height, 'height');
    const offsetStyle = styleUpdater.setStyleOffset(offsetX, offsetY);
    resizeApplication.updateResize({ height, offsetX, offsetY }, { ...heightStyle, ...offsetStyle });
  });
}

/** 调整水平与垂直方向 */
function resizeHorizontalAndVertical(resizeApplication: ResizeApplication, resizingWidthFn: ResizingFn, resizingHeightFn: ResizingFn) {
  const { options, resizeDistance, styleUpdater, domAttrs, axisParams } = resizeApplication;
  const { size: { aspectRatio }, pointerDir } = domAttrs;
  const { lockAspectRatio } = options;
  // 延续之前的移动距离
  const dirX = axisParams.x.dir || 0.5 * pointerDir.x;
  const dirY = axisParams.y.dir || 0.5 * pointerDir.y;
  const distanceX = resizeDistance.x.total;
  const distanceY = resizeDistance.y.total;
  const updateDom = (coord: { startX: number, startY: number, endX: number, endY: number }) => {
    const { value: width, offset: resizeOffsetX, otherOffset: otherOffsetY } = resizingWidthFn(coord.startX, coord.endX + dirX * distanceX, 'x', pointerDir.x);
    const { value: height, offset: resizeOffsetY, otherOffset: otherOffsetX } = resizingHeightFn(coord.startY, coord.endY + dirY * distanceY, 'y', pointerDir.y);
    if ((!resizeDistance.x.distance && !resizeDistance.y.distance) // 移动距离为0时，不更新dom
      || (lockAspectRatio && (!resizeDistance.x.distance || !resizeDistance.y.distance))) { // 锁定比例时，任意一个方向的移动距离为0时，不更新dom
      return;
    }
    const offsetX = resizeOffsetX - otherOffsetX;
    const offsetY = resizeOffsetY + otherOffsetY;
    const widthStyle = styleUpdater.setStyleWidthOrHeight(width, 'width');
    const heightStyle = styleUpdater.setStyleWidthOrHeight(height, 'height');
    const offsetStyle = styleUpdater.setStyleOffset(offsetX, offsetY);
    resizeApplication.updateResize({ width, height, offsetX, offsetY }, { ...widthStyle, ...heightStyle, ...offsetStyle });
  };

  if (lockAspectRatio) {
    // 固定比例时，宽度根据鼠标位置决定，高度的调整根据宽度的变化与元素宽高比例决定
    // 根据宽高调整的方向处理
    let dir = resizingWidthFn === resizingHeightFn ? 1 : -1;
    const isBothX = !axisParams.x.dir;
    const isBothY = !axisParams.y.dir;
    if (isBothX || isBothY) {
      if (!isBothY) {
        // x轴可以左右移动，但y轴固定方向
        dir = -dir * axisParams.y.dir * pointerDir.x * 2;
      }
      else if (!isBothX) {
        // y轴可以上下移动，但x轴固定方向
        dir = -dir * axisParams.x.dir * pointerDir.y / 2;
      }
      else {
        // x轴和y轴都可以左右上下移动
        dir = pointerDir.x * pointerDir.y;
      }
    }

    beginResizeContent(resizeApplication, ({ startX, endX }) => {
      const startY = (dir * startX) / aspectRatio;
      const endY = (dir * endX) / aspectRatio;
      updateDom({ startX, startY, endX, endY });
    });
  }
  else {
    // 不固定比例时，宽高根据鼠标位置决定
    beginResizeContent(resizeApplication, ({ startX, endX, startY, endY }) => {
      updateDom({ startX, startY, endX, endY });
    });
  }
}

/** 当前正在使用的指针id集合 */
const resizePointerIdSet = new Set<number>();

/** 使用指针调整大小 */
function beginResizeContent(
  resizeApplication: ResizeApplication,
  moveFn: (coord: { startX: number, endX: number, startY: number, endY: number }) => void,
) {
  const target = resizeApplication.options.target || document.body;
  const targetRef = new WeakRef(target);
  if (!resizeApplication.options.pointer) { return; }
  // 开始
  const pointerId = resizeApplication.options.pointer.pointerId;
  if (!resizePointerIdSet.has(pointerId)) {
    resizePointerIdSet.add(pointerId);
    target.setPointerCapture(resizeApplication.options.pointer.pointerId);
  }
  resizeApplication.onPointerBegin();

  // 移动
  const moveHandler = getMoveHandler(resizeApplication, (coord) => {
    moveFn(coord);
    resizeApplication.onPointerMove();
  });
  target.addEventListener('pointermove', moveHandler);

  // 结束
  const upHandler = (overEvent: PointerEvent) => {
    const targetDeref = targetRef.deref();
    targetDeref?.releasePointerCapture(overEvent.pointerId);
    resizePointerIdSet.delete(overEvent.pointerId);
    targetDeref?.removeEventListener('pointermove', moveHandler);
    targetDeref?.removeEventListener('pointerup', upHandler);
    targetDeref?.removeEventListener('pointercancel', upHandler);
    resizeApplication.clearPointer();
    resizeApplication.onPointerEnd();
  };
  target.addEventListener('pointerup', upHandler);
  target.addEventListener('pointercancel', upHandler);
}

/** 获取移动计算函数 */
function getMoveHandler(
  resizeApplication: ResizeApplication,
  moveFn: (coord: { startX: number, endX: number, startY: number, endY: number }) => void,
) {
  const { scaleX, scaleY, rotate } = resizeApplication.domAttrs.variant;
  // 计算起始点坐标
  const clientX = resizeApplication.options.pointer!.clientX;
  const clientY = resizeApplication.options.pointer!.clientY;
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
