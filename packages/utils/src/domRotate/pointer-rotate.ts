import type { RotateApplication } from './rotate-core/rotate-application';

export function rotateByPointer(rotateApplication: RotateApplication) {
  if (!rotateApplication.options.pointer) {
    return;
  }
  const pointerPosition = getPointerPosition(rotateApplication);
  const lastRotateAngle = rotateApplication.rotateAngle.total;
  return beginRotateContent(rotateApplication, ({ startX, endX, startY, endY }) => {
    const { rotateHandler, rotateAngle, rotateStyleUpdater } = rotateApplication;
    const moveX = pointerPosition.x - (startX - endX);
    const moveY = pointerPosition.y - (startY - endY);
    const moveDeg = Math.atan2(moveY, moveX) * (180 / Math.PI); // 得出当前指针位置与变化原点之间的角度
    const angle = rotateHandler.rotating(moveDeg - pointerPosition.deg + lastRotateAngle); // 将当前角度减去初始的角度，得到旋转角度
    if (!rotateAngle.angle) { return; }
    const rotateStyle = rotateStyleUpdater.setStyleRotate(angle);
    rotateApplication.updateRotate({ rotate: angle }, rotateStyle);
  });
}

/** 获取指针与变化原点的位置信息 */
function getPointerPosition(rotateApplication: RotateApplication) {
  if (!rotateApplication.options.target || !rotateApplication.options.pointer) { return { x: 0, y: 0, deg: 0 }; }

  const { rotateDomAttrs } = rotateApplication;
  /** 设置鼠标相对于元素变化原点的位置 */
  const setPointerPositionByOriginCoord = (transformOriginCoordX: number, transformOriginCoordY: number) => {
    const x = rotateApplication.options.pointer!.clientX - transformOriginCoordX;
    const y = rotateApplication.options.pointer!.clientY - transformOriginCoordY;
    const deg = Math.atan2(y, x) * (180 / Math.PI);
    return { x, y, deg };
  };

  if (rotateDomAttrs.variant.transformOriginX === 0.5 && rotateDomAttrs.variant.transformOriginY === 0.5) {
    // 获取指针的位置信息(变化原点是默认的以元素的中心旋转)
    const rect = rotateApplication.options.target.getBoundingClientRect();
    const transformOriginCoordX = rect.left + rect.width / 2;
    const transformOriginCoordY = rect.top + rect.height / 2;
    return setPointerPositionByOriginCoord(transformOriginCoordX, transformOriginCoordY);
  }
  else {
    // 获取指针的位置信息(变换原点有经过其他方式设置)
    const rect = rotateApplication.options.target.getBoundingClientRect();
    // 旋转角度，其值在-360~360之间
    const rotateAngle = rotateDomAttrs.variant.rotate % 360;
    // 将角度标准化到 [-180, 180] 范围
    let normalizedAngle = rotateAngle;
    if (rotateAngle > 180) { normalizedAngle = rotateAngle - 360; }
    else if (rotateAngle < -180) { normalizedAngle = rotateAngle + 360; }
    // 标准旋转角度的正数
    const absNormalizedAngle = Math.abs(normalizedAngle);
    // 计算变换原点坐标
    const { x: originPositionX, y: originPositionY } = rotateDomAttrs.variant.originPosition;
    const acuteRotate = absNormalizedAngle > 90 ? 180 - absNormalizedAngle : absNormalizedAngle; // 转化为锐角，其值在0~90之间
    const angleRad = acuteRotate * Math.PI / 180;
    const angleSin = Math.sin(angleRad);
    const angleCos = Math.cos(angleRad);
    // 获取旋转后的变形原点位置
    let transformOriginCoordX = 0;
    let transformOriginCoordY = 0;
    if (absNormalizedAngle > 90 && normalizedAngle < 0) {
      transformOriginCoordX = rect.right - originPositionX * angleCos - (rotateDomAttrs.domHeight - originPositionY) * angleSin;
      transformOriginCoordY = rect.bottom - originPositionX * angleSin - originPositionY * angleCos;
    }
    else if (absNormalizedAngle >= 90 && normalizedAngle >= 0) {
      transformOriginCoordX = rect.right - originPositionX * angleCos - originPositionY * angleSin;
      transformOriginCoordY = rect.top + originPositionX * angleSin + (rotateDomAttrs.domHeight - originPositionY) * angleCos;
    }
    else if (absNormalizedAngle < 90 && normalizedAngle > 0) {
      transformOriginCoordX = rect.left + originPositionX * angleCos + (rotateDomAttrs.domHeight - originPositionY) * angleSin;
      transformOriginCoordY = rect.top + originPositionX * angleSin + originPositionY * angleCos;
    }
    else if (absNormalizedAngle <= 90 && normalizedAngle <= 0) {
      transformOriginCoordX = rect.left + originPositionX * angleCos + originPositionY * angleSin;
      transformOriginCoordY = rect.bottom - originPositionX * angleSin - (rotateDomAttrs.domHeight - originPositionY) * angleCos;
    }
    return setPointerPositionByOriginCoord(transformOriginCoordX, transformOriginCoordY);
  }
}

/** 当前正在使用的指针id集合 */
const rotatePointerIdSet = new Set<number>();

/** 使用指针调整旋转 */
function beginRotateContent(
  rotateApplication: RotateApplication,
  moveFn: (coord: { startX: number, endX: number, startY: number, endY: number }) => void,
) {
  const { options } = rotateApplication;
  if (!options.pointer) { return; }

  const target = options.pointerTarget || options.target || document.body;
  const targetRef = new WeakRef(target);
  // 开始
  const pointerId = options.pointer.pointerId;
  if (!rotatePointerIdSet.has(pointerId)) {
    rotatePointerIdSet.add(pointerId);
    target.setPointerCapture(options.pointer.pointerId);
  }
  rotateApplication.onPointerBegin();

  // 移动
  const startX = options.pointer.clientX;
  const startY = options.pointer.clientY;
  const moveHandler = (moveEvent: PointerEvent) => {
    const endX = moveEvent.clientX;
    const endY = moveEvent.clientY;
    moveFn({ startX, endX, startY, endY });
    rotateApplication.onPointerMove();
  };
  target.addEventListener('pointermove', moveHandler);

  // 结束
  const endHandler = () => {
    const targetDeref = targetRef.deref();
    targetDeref?.releasePointerCapture(pointerId);
    rotatePointerIdSet.delete(pointerId);
    targetDeref?.removeEventListener('pointermove', moveHandler);
    targetDeref?.removeEventListener('pointerup', endHandler);
    targetDeref?.removeEventListener('pointercancel', endHandler);
    rotateApplication.clearPointer();
    rotateApplication.onPointerEnd();
  };
  if (!options.disablePointerEnd) {
    target.addEventListener('pointerup', endHandler);
    target.addEventListener('pointercancel', endHandler);
  }

  return endHandler;
}
