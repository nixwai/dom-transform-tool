import type { DragApplication } from './drag-core/drag-application';

export function dragByManual(dragApplication: DragApplication) {
  if (!dragApplication.dragAxisParams.x.manualDistance && !dragApplication.dragAxisParams.y.manualDistance) {
    return;
  }

  const { options, dragDomAttrs, dragAxisParams, dragHandler, dragLogger, dragStyleUpdater } = dragApplication;
  const lastOffsetX = dragLogger.x.total;
  const lastOffsetY = dragLogger.y.total;

  let offsetX = dragDomAttrs.offsetX;
  if (options.direction !== 'y') {
    offsetX = dragHandler.dragging(0, dragAxisParams.x.manualDistance + lastOffsetX, 'x');
  }
  let offsetY = dragDomAttrs.offsetY;
  if (options.direction !== 'x') {
    offsetY = dragHandler.dragging(0, dragAxisParams.y.manualDistance + lastOffsetY, 'y');
  }

  if (!dragLogger.x.distance && !dragLogger.y.distance) { return; }

  const offsetStyle = dragStyleUpdater.setStyleOffset(offsetX, offsetY);
  dragApplication.updateDrag({ offsetX, offsetY }, offsetStyle);
  dragApplication.clearManual();
}
