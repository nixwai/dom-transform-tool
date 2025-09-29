import type { Dir } from '../typing';
import type { ResizeApplication, ResizingFn } from './resize-core/resize-application';

interface MoveCoord {
  startX: number
  endX: number
  startY: number
  endY: number
}

export function resizeByPointer(resizeApplication: ResizeApplication) {
  if (!resizeApplication.options.pointer) {
    return;
  }
  return resizeApplication.resizeByDirection(resizeHorizontal, resizeVertical, resizeHorizontalAndVertical);
}

/** 调整水平方向 */
function resizeHorizontal(resizeApplication: ResizeApplication, resizingWidthFn: ResizingFn) {
  const { resizeDistance, resizeStyleUpdater, resizeDomAttrs, resizeAxisParams } = resizeApplication;
  const { offsetY: domOffsetY } = resizeDomAttrs;
  const pointerDir = getPointerDirection(resizeApplication);
  // 延续之前的移动距离
  const dir = resizeAxisParams.x.dir || 0.5 * pointerDir.x;
  const lastDistanceX = dir * resizeDistance.x.total;
  return beginResizeContent(resizeApplication, ({ startX, endX }) => {
    const { value: width, offset: offsetX, otherOffset: otherOffsetY } = resizingWidthFn(startX, endX + lastDistanceX, 'x', pointerDir.x);
    if (!resizeDistance.x.distance) { return; }
    const offsetY = domOffsetY + otherOffsetY;
    const widthStyle = resizeStyleUpdater.setStyleWidthOrHeight(width, 'width');
    const offsetStyle = resizeStyleUpdater.setStyleOffset(offsetX, offsetY);
    resizeApplication.updateResize({ width, offsetX, offsetY }, { ...widthStyle, ...offsetStyle });
  });
}

/** 调整垂直方向 */
function resizeVertical(resizeApplication: ResizeApplication, resizingHeightFn: ResizingFn) {
  const { resizeDistance, resizeStyleUpdater, resizeDomAttrs, resizeAxisParams } = resizeApplication;
  const { offsetX: domOffsetX } = resizeDomAttrs;
  const pointerDir = getPointerDirection(resizeApplication);
  // 延续之前的移动距离
  const dir = resizeAxisParams.y.dir || 0.5 * pointerDir.y;
  const lastDistanceY = dir * resizeDistance.y.total;
  return beginResizeContent(resizeApplication, ({ startY, endY }) => {
    const { value: height, offset: offsetY, otherOffset: otherOffsetX } = resizingHeightFn(startY, endY + lastDistanceY, 'y', pointerDir.y);
    if (!resizeDistance.y.distance) { return; }
    const offsetX = domOffsetX - otherOffsetX;
    const heightStyle = resizeStyleUpdater.setStyleWidthOrHeight(height, 'height');
    const offsetStyle = resizeStyleUpdater.setStyleOffset(offsetX, offsetY);
    resizeApplication.updateResize({ height, offsetX, offsetY }, { ...heightStyle, ...offsetStyle });
  });
}

/** 调整水平与垂直方向 */
function resizeHorizontalAndVertical(resizeApplication: ResizeApplication, resizingWidthFn: ResizingFn, resizingHeightFn: ResizingFn) {
  const { options, resizeDistance, resizeStyleUpdater, resizeDomAttrs, resizeAxisParams } = resizeApplication;
  const { size: { aspectRatio } } = resizeDomAttrs;
  const { lockAspectRatio } = options;
  const pointerDir = getPointerDirection(resizeApplication);
  // 延续之前的移动距离
  const dirX = resizeAxisParams.x.dir || 0.5 * pointerDir.x;
  const dirY = resizeAxisParams.y.dir || 0.5 * pointerDir.y;
  const lastDistanceX = dirX * resizeDistance.x.total;
  const lastDistanceY = dirY * resizeDistance.y.total;
  const updateDom = (coord: MoveCoord) => {
    const { value: width, offset: resizeOffsetX, otherOffset: otherOffsetY } = resizingWidthFn(coord.startX, coord.endX + lastDistanceX, 'x', pointerDir.x);
    const { value: height, offset: resizeOffsetY, otherOffset: otherOffsetX } = resizingHeightFn(coord.startY, coord.endY + lastDistanceY, 'y', pointerDir.y);
    if ((!resizeDistance.x.distance && !resizeDistance.y.distance) // 移动距离为0时，不更新dom
      || (lockAspectRatio && (!resizeDistance.x.distance || !resizeDistance.y.distance))) { // 锁定比例时，任意一个方向的移动距离为0时，不更新dom
      return;
    }
    const offsetX = resizeOffsetX - otherOffsetX;
    const offsetY = resizeOffsetY + otherOffsetY;
    const widthStyle = resizeStyleUpdater.setStyleWidthOrHeight(width, 'width');
    const heightStyle = resizeStyleUpdater.setStyleWidthOrHeight(height, 'height');
    const offsetStyle = resizeStyleUpdater.setStyleOffset(offsetX, offsetY);
    resizeApplication.updateResize({ width, height, offsetX, offsetY }, { ...widthStyle, ...heightStyle, ...offsetStyle });
  };

  if (lockAspectRatio) {
    // 固定比例时，宽度根据鼠标位置决定，高度的调整根据宽度的变化与元素宽高比例决定
    // 根据宽高调整的方向处理
    let dir = resizingWidthFn === resizingHeightFn ? 1 : -1;
    const isBothX = !resizeAxisParams.x.dir;
    const isBothY = !resizeAxisParams.y.dir;
    if (isBothX || isBothY) {
      if (!isBothY) {
        // x轴可以左右移动，但y轴固定方向
        dir = -dir * resizeAxisParams.y.dir * pointerDir.x * 2;
      }
      else if (!isBothX) {
        // y轴可以上下移动，但x轴固定方向
        dir = -dir * resizeAxisParams.x.dir * pointerDir.y / 2;
      }
      else {
        // x轴和y轴都可以左右上下移动
        dir = pointerDir.x * pointerDir.y;
      }
    }

    return beginResizeContent(resizeApplication, ({ startX, endX }) => {
      const startY = (dir * startX) / aspectRatio;
      const endY = (dir * endX) / aspectRatio;
      updateDom({ startX, startY, endX, endY });
    });
  }
  else {
    // 不固定比例时，宽高根据鼠标位置决定
    return beginResizeContent(resizeApplication, updateDom);
  }
}

/** 获取指针点击的位置方向 */
function getPointerDirection(resizeApplication: ResizeApplication): { x: Dir, y: Dir } {
  if (!resizeApplication.options.target || !resizeApplication.options.pointer) {
    return { x: 1, y: 1 };
  }
  const rect = resizeApplication.options.target.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  // 鼠标相对于元素中心的坐标
  const pointerX = resizeApplication.options.pointer.clientX - centerX;
  const pointerY = resizeApplication.options.pointer.clientY - centerY;
  // 旋转角度（转换为弧度）
  const angleRad = -resizeApplication.resizeDomAttrs.variant.rotate * Math.PI / 180;
  // 应用逆时针旋转矩阵
  const rotatedX = pointerX * Math.cos(angleRad) - pointerY * Math.sin(angleRad);
  const rotatedY = pointerX * Math.sin(angleRad) + pointerY * Math.cos(angleRad);
  // 根据旋转后的坐标判断方向
  return {
    x: rotatedX > 0 ? 1 : -1,
    y: rotatedY > 0 ? 1 : -1,
  };
}

/** 当前正在使用的指针id集合 */
const resizePointerIdSet = new Set<number>();

/** 使用指针调整大小 */
function beginResizeContent(resizeApplication: ResizeApplication, moveFn: (coord: MoveCoord) => void) {
  const { options } = resizeApplication;
  if (!options.pointer) { return; }

  const target = options.pointerTarget || options.target || document.body;
  const targetRef = new WeakRef(target);
  // 开始
  const pointerId = options.pointer.pointerId;
  if (!resizePointerIdSet.has(pointerId)) {
    resizePointerIdSet.add(pointerId);
    target.setPointerCapture(options.pointer.pointerId);
  }
  resizeApplication.onPointerBegin();

  // 移动
  const moveHandler = transformMoveCoord(resizeApplication, (coord) => {
    moveFn(coord);
    resizeApplication.onPointerMove();
  });
  target.addEventListener('pointermove', moveHandler);

  // 结束
  const endHandler = () => {
    const targetDeref = targetRef.deref();
    targetDeref?.releasePointerCapture(pointerId);
    resizePointerIdSet.delete(pointerId);
    targetDeref?.removeEventListener('pointermove', moveHandler);
    targetDeref?.removeEventListener('pointerup', endHandler);
    targetDeref?.removeEventListener('pointercancel', endHandler);
    resizeApplication.clearPointer();
    resizeApplication.onPointerEnd();
  };
  if (!options.disablePointerEnd) {
    target.addEventListener('pointerup', endHandler);
    target.addEventListener('pointercancel', endHandler);
  }
  return endHandler;
}

/** 转化指针移动坐标，兼容旋转条件 */
function transformMoveCoord(resizeApplication: ResizeApplication, moveCoordFn: (coord: MoveCoord) => void) {
  const { scaleX, scaleY, rotate } = resizeApplication.resizeDomAttrs.variant;
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
      moveCoordFn({ startX, endX, startY, endY });
    };
  }
  else {
    const startX = clientX / scaleX;
    const startY = clientY / scaleY;
    return (moveEvent: PointerEvent) => {
      const endX = moveEvent.clientX / scaleX;
      const endY = moveEvent.clientY / scaleY;
      moveCoordFn({ startX, endX, startY, endY });
    };
  }
}
