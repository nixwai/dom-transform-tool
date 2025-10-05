import type { DragApplication } from './drag-core/drag-application';

export function dragByManual(dragApplication: DragApplication) {
  if (!dragApplication.dragParams.manualOffsetX && !dragApplication.dragParams.manualOffsetY) {
    return;
  }

  const { dragParams, dragHandler, dragLogger, dragStyleUpdater } = dragApplication;
  const lastOffsetX = dragLogger.x.total;
  const lastOffsetY = dragLogger.y.total;

  let offsetX = dragHandler.dragging(0, dragParams.manualOffsetX + lastOffsetX, 'x');
  let offsetY = dragHandler.dragging(0, dragParams.manualOffsetY + lastOffsetY, 'y');

  // 根据方向限制
  if (dragParams.direction === 'x') {
    offsetY = dragApplication.dragDomAttrs.offsetY;
  }
  else if (dragParams.direction === 'y') {
    offsetX = dragApplication.dragDomAttrs.offsetX;
  }

  if (!dragLogger.x.distance && !dragLogger.y.distance) { return; }

  const offsetStyle = dragStyleUpdater.setStyleOffset(offsetX, offsetY);
  dragApplication.updateDrag({ offsetX, offsetY }, offsetStyle);
  dragApplication.clearManual();
}
