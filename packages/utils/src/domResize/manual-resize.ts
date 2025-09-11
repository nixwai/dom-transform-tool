import type { ResizeApplication, ResizingFn } from './core/resize-application';

export function resizeByManual(resizeApplication: ResizeApplication) {
  if (!resizeApplication.axisParams.x.manualDistance && !resizeApplication.axisParams.y.manualDistance) {
    return;
  }
  resizeApplication.resizeByDirection(resizeHorizontal, resizeVertical, resizeHorizontalAndVertical);
}

/** 调整水平方向 */
function resizeHorizontal(resizeApplication: ResizeApplication, resizingWidthFn: ResizingFn) {
  const { resizeDistance, styleUpdater, domAttrs, axisParams, resizeHandler } = resizeApplication;
  const { manualDistance } = axisParams.x;
  const { width: domWidth, offsetY: domOffsetY } = domAttrs;
  const dir = resizingWidthFn === resizeHandler.resizingBackward ? -1 : 1;
  const distanceX = resizeDistance.x.total / (resizingWidthFn === resizeHandler.resizingBoth ? 2 : 1);;
  const { value: width, offset: offsetX, otherOffset: otherOffsetY } = resizingWidthFn(domWidth, domWidth + dir * manualDistance + dir * distanceX, 'x');
  if (!resizeDistance.x.distance) { return; }
  const offsetY = domOffsetY + otherOffsetY;
  const widthStyle = styleUpdater.setStyleWidthOrHeight(width, 'width');
  const offsetStyle = styleUpdater.setStyleOffset(offsetX, offsetY);
  resizeApplication.updateResize({ width, offsetX, offsetY }, { ...widthStyle, ...offsetStyle });
}

/** 调整垂直方向 */
function resizeVertical(resizeApplication: ResizeApplication, resizingHeightFn: ResizingFn) {
  const { resizeDistance, styleUpdater, domAttrs, axisParams, resizeHandler } = resizeApplication;
  const { manualDistance } = axisParams.y;
  const { height: domHeight, offsetX: domOffsetX } = domAttrs;
  const dir = resizingHeightFn === resizeHandler.resizingBackward ? -1 : 1;
  const distanceY = resizeDistance.y.total / (resizingHeightFn === resizeHandler.resizingBoth ? 2 : 1);
  const { value: height, offset: offsetY, otherOffset: otherOffsetX } = resizingHeightFn(domHeight, domHeight + dir * manualDistance + dir * distanceY, 'y');
  if (!resizeDistance.y.distance) { return; }
  const offsetX = domOffsetX - otherOffsetX;
  const heightStyle = styleUpdater.setStyleWidthOrHeight(height, 'height');
  const offsetStyle = styleUpdater.setStyleOffset(offsetX, offsetY);
  resizeApplication.updateResize({ height, offsetX, offsetY }, { ...heightStyle, ...offsetStyle });
}

/** 调整水平与垂直方向 */
function resizeHorizontalAndVertical(resizeApplication: ResizeApplication, resizingWidthFn: ResizingFn, resizingHeightFn: ResizingFn) {
  const { resizeDistance, styleUpdater, domAttrs, axisParams, resizeHandler } = resizeApplication;
  const { lockAspectRatio } = resizeApplication.options;
  const { width: domWidth, height: domHeight, aspectRatio } = domAttrs;

  const updateDom = (options: { distanceX: number, distanceY: number }) => {
    const dirX = resizingWidthFn === resizeHandler.resizingBackward ? -1 : 1;
    const dirY = resizingHeightFn === resizeHandler.resizingBackward ? -1 : 1;
    const distanceX = resizeDistance.x.total / (resizingWidthFn === resizeHandler.resizingBoth ? 2 : 1);
    const distanceY = resizeDistance.y.total / (resizingHeightFn === resizeHandler.resizingBoth ? 2 : 1);
    
    const { value: width, offset: resizeOffsetX, otherOffset: otherOffsetY } = resizingWidthFn(domWidth, domWidth + dirX * options.distanceX + dirX * distanceX, 'x');
    const { value: height, offset: resizeOffsetY, otherOffset: otherOffsetX } = resizingHeightFn(domHeight, domHeight + dirY * options.distanceY + dirY * distanceY, 'y');
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

  const { manualDistance: manualDistanceX } = axisParams.x;
  const { manualDistance: manualDistanceY } = axisParams.y;
  if (lockAspectRatio) {
    if (manualDistanceX) {
      let multiple = !resizeDistance.x.dir && resizeDistance.y.dir ? 2 : 1;
      multiple = resizeDistance.x.dir && !resizeDistance.y.dir ? 0.5 : multiple;
      updateDom({ distanceX: manualDistanceX, distanceY: manualDistanceX / aspectRatio * multiple });
    }
    else {
      let multiple = !resizeDistance.x.dir && resizeDistance.y.dir ? 0.5 : 1;
      multiple = resizeDistance.x.dir && !resizeDistance.y.dir ? 2 : multiple;
      updateDom({ distanceX: manualDistanceY * aspectRatio * multiple, distanceY: manualDistanceY });
    }
  }
  else {
    updateDom({ distanceX: manualDistanceX, distanceY: manualDistanceY });
  }
}
