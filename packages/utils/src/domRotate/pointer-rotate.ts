import type { RotateApplication } from './rotate-core/rotate-application';

export function rotateByPointer(rotateApplication: RotateApplication) {
  if (!rotateApplication.options.pointer) {
    return;
  }

  beginRotateContent(rotateApplication, ({ startX, endX, startY, endY }) => {
    const { rotateHandler, rotateAngle, rotateStyleUpdater, rotateDomAttrs } = rotateApplication;
    const { x, y, deg } = rotateDomAttrs.pointerPosition;
    const moveX = x - (startX - endX);
    const moveY = y - (startY - endY);
    const moveDeg = Math.atan2(moveY, moveX) * (180 / Math.PI);
    const angle = rotateHandler.rotating(moveDeg - deg);
    if (!rotateAngle.angle) { return; }
    const rotateStyle = rotateStyleUpdater.setStyleRotate(angle);
    rotateApplication.updateRotate({ rotate: angle }, rotateStyle);
  });
}

/** 当前正在使用的指针id集合 */
const rotatePointerIdSet = new Set<number>();

/** 使用指针调整旋转 */
function beginRotateContent(
  rotateApplication: RotateApplication,
  moveFn: (coord: { startX: number, endX: number, startY: number, endY: number }) => void,
) {
  const target = rotateApplication.options.target || document.body;
  const targetRef = new WeakRef(target);
  if (!rotateApplication.options.pointer) { return; }
  // 开始
  const pointerId = rotateApplication.options.pointer.pointerId;
  if (!rotatePointerIdSet.has(pointerId)) {
    rotatePointerIdSet.add(pointerId);
    target.setPointerCapture(rotateApplication.options.pointer.pointerId);
  }
  rotateApplication.onPointerBegin();

  // 移动
  const startX = rotateApplication.options.pointer.clientX;
  const startY = rotateApplication.options.pointer.clientY;
  const moveHandler = (moveEvent: PointerEvent) => {
    const endX = moveEvent.clientX;
    const endY = moveEvent.clientY;
    moveFn({ startX, endX, startY, endY });
    rotateApplication.onPointerMove();
  }; ;
  target.addEventListener('pointermove', moveHandler);

  // 结束
  const upHandler = (overEvent: PointerEvent) => {
    const targetDeref = targetRef.deref();
    targetDeref?.releasePointerCapture(overEvent.pointerId);
    rotatePointerIdSet.delete(overEvent.pointerId);
    targetDeref?.removeEventListener('pointermove', moveHandler);
    targetDeref?.removeEventListener('pointerup', upHandler);
    targetDeref?.removeEventListener('pointercancel', upHandler);
    rotateApplication.clearPointer();
    rotateApplication.onPointerEnd();
  };
  target.addEventListener('pointerup', upHandler);
  target.addEventListener('pointercancel', upHandler);
}
