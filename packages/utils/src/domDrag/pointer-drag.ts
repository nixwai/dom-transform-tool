import type { DragApplication } from './drag-core/drag-application';

interface MoveCoord {
  startX: number
  endX: number
  startY: number
  endY: number
}

/** 当前正在使用的指针id集合 */
const dragPointerIdSet = new Set<number>();

export function dragByPointer(dragApplication: DragApplication) {
  if (!dragApplication.options.pointer) {
    return;
  }
  return beginDragContent(dragApplication, ({ startX, endX, startY, endY }) => {
    const { dragHandler, dragLogger, dragStyleUpdater } = dragApplication;

    let offsetX = dragHandler.dragging(startX, endX, 'x');
    let offsetY = dragHandler.dragging(startY, endY, 'y');

    // 根据方向限制
    if (dragApplication.dragParams.direction === 'x') {
      offsetY = dragApplication.dragDomAttrs.offsetY;
    }
    else if (dragApplication.dragParams.direction === 'y') {
      offsetX = dragApplication.dragDomAttrs.offsetX;
    }

    if (!dragLogger.x.distance && !dragLogger.y.distance) { return; }

    const offsetStyle = dragStyleUpdater.setStyleOffset(offsetX, offsetY);
    dragApplication.updateDrag({ offsetX, offsetY }, offsetStyle);
  });
}

/** 使用指针拖动 */
function beginDragContent(
  dragApplication: DragApplication,
  moveFn: (coord: MoveCoord) => void,
) {
  const { options } = dragApplication;
  if (!options.pointer) { return; }

  const target = options.pointerTarget || options.target || document.body;
  const targetRef = new WeakRef(target);
  // 开始
  const pointerId = options.pointer.pointerId;
  if (!dragPointerIdSet.has(pointerId)) {
    dragPointerIdSet.add(pointerId);
    target.setPointerCapture(options.pointer.pointerId);
  }
  dragApplication.onPointerBegin();

  // 移动
  const startX = options.pointer.clientX;
  const startY = options.pointer.clientY;
  const moveHandler = (moveEvent: PointerEvent) => {
    const endX = moveEvent.clientX;
    const endY = moveEvent.clientY;
    moveFn({ startX, endX, startY, endY });
    dragApplication.onPointerMove();
  };
  target.addEventListener('pointermove', moveHandler);

  // 结束
  const endHandler = () => {
    const targetDeref = targetRef.deref();
    targetDeref?.releasePointerCapture(pointerId);
    dragPointerIdSet.delete(pointerId);
    targetDeref?.removeEventListener('pointermove', moveHandler);
    targetDeref?.removeEventListener('pointerup', endHandler);
    targetDeref?.removeEventListener('pointercancel', endHandler);
    dragApplication.clearPointer();
    dragApplication.onPointerEnd();
  };
  if (!options.disablePointerEnd) {
    target.addEventListener('pointerup', endHandler);
    target.addEventListener('pointercancel', endHandler);
  }

  return endHandler;
}
