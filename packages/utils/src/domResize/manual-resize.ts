import type { ResizeApplication, ResizingFn } from './resize-core/resize-application';

export function resizeByManual(resizeApplication: ResizeApplication) {
  if (!resizeApplication.resizeAxisParams.x.manualDistance && !resizeApplication.resizeAxisParams.y.manualDistance) {
    return;
  }
  resizeApplication.resizeByDirection(resizeHorizontal, resizeVertical, resizeHorizontalAndVertical);
  resizeApplication.clearManual();
}

/** 调整水平方向 */
function resizeHorizontal(resizeApplication: ResizeApplication, resizingWidthFn: ResizingFn) {
  const { resizeDistance, resizeStyleUpdater, resizeDomAttrs, resizeAxisParams } = resizeApplication;
  const { manualDistance } = resizeAxisParams.x;
  const domWidth = resizeDomAttrs.size.width;
  const domOffsetY = resizeDomAttrs.offsetY;
  const dir = resizeAxisParams.x.dir || 1;
  const lastDistanceX = resizeDistance.x.total * (resizeAxisParams.x.dir || 0.5);
  const { value: width, offset: offsetX, otherOffset: otherOffsetY } = resizingWidthFn(domWidth, domWidth + dir * manualDistance + lastDistanceX, 'x');
  if (!resizeDistance.x.distance) { return; }
  const offsetY = domOffsetY + otherOffsetY;
  const widthStyle = resizeStyleUpdater.setStyleWidthOrHeight(width, 'width');
  const offsetStyle = resizeStyleUpdater.setStyleOffset(offsetX, offsetY);
  resizeApplication.updateResize({ width, offsetX, offsetY }, { ...widthStyle, ...offsetStyle });
}

/** 调整垂直方向 */
function resizeVertical(resizeApplication: ResizeApplication, resizingHeightFn: ResizingFn) {
  const { resizeDistance, resizeStyleUpdater, resizeDomAttrs, resizeAxisParams } = resizeApplication;
  const { manualDistance } = resizeAxisParams.y;
  const domHeight = resizeDomAttrs.size.height;
  const domOffsetX = resizeDomAttrs.offsetX;
  const dir = resizeAxisParams.y.dir || 1;
  const lastDistanceY = resizeDistance.y.total * (resizeAxisParams.y.dir || 0.5);
  const { value: height, offset: offsetY, otherOffset: otherOffsetX } = resizingHeightFn(domHeight, domHeight + dir * manualDistance + lastDistanceY, 'y');
  if (!resizeDistance.y.distance) { return; }
  const offsetX = domOffsetX - otherOffsetX;
  const heightStyle = resizeStyleUpdater.setStyleWidthOrHeight(height, 'height');
  const offsetStyle = resizeStyleUpdater.setStyleOffset(offsetX, offsetY);
  resizeApplication.updateResize({ height, offsetX, offsetY }, { ...heightStyle, ...offsetStyle });
}

/** 调整水平与垂直方向 */
function resizeHorizontalAndVertical(resizeApplication: ResizeApplication, resizingWidthFn: ResizingFn, resizingHeightFn: ResizingFn) {
  const { resizeDistance, resizeStyleUpdater, resizeDomAttrs, resizeAxisParams } = resizeApplication;
  const { lockAspectRatio } = resizeApplication.options;
  const { width: domWidth, height: domHeight, aspectRatio } = resizeDomAttrs.size;

  const updateDom = (move: { distanceX: number, distanceY: number }) => {
    const dirX = resizeAxisParams.x.dir || 1;
    const dirY = resizeAxisParams.y.dir || 1;
    const lastDistanceX = resizeDistance.x.total * (resizeAxisParams.x.dir || 0.5);
    const lastDistanceY = resizeDistance.y.total * (resizeAxisParams.y.dir || 0.5);

    const { value: width, offset: resizeOffsetX, otherOffset: otherOffsetY } = resizingWidthFn(domWidth, domWidth + dirX * move.distanceX + lastDistanceX, 'x');
    const { value: height, offset: resizeOffsetY, otherOffset: otherOffsetX } = resizingHeightFn(domHeight, domHeight + dirY * move.distanceY + lastDistanceY, 'y');
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

  const { manualDistance: manualDistanceX } = resizeAxisParams.x;
  const { manualDistance: manualDistanceY } = resizeAxisParams.y;
  if (lockAspectRatio) {
    if (manualDistanceX) {
      let multiple = !resizeAxisParams.x.dir && resizeAxisParams.y.dir ? 2 : 1;
      multiple = resizeAxisParams.x.dir && !resizeAxisParams.y.dir ? 0.5 : multiple;
      updateDom({ distanceX: manualDistanceX, distanceY: manualDistanceX / aspectRatio * multiple });
    }
    else {
      let multiple = !resizeAxisParams.x.dir && resizeAxisParams.y.dir ? 0.5 : 1;
      multiple = resizeAxisParams.x.dir && !resizeAxisParams.y.dir ? 2 : multiple;
      updateDom({ distanceX: manualDistanceY * aspectRatio * multiple, distanceY: manualDistanceY });
    }
  }
  else {
    updateDom({ distanceX: manualDistanceX, distanceY: manualDistanceY });
  }
}
