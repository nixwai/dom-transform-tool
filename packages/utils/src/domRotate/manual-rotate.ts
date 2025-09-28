import type { RotateApplication } from './rotate-core/rotate-application';

export function rotateByManual(rotateApplication: RotateApplication) {
  if (!rotateApplication.rotateParams.manualRotate) {
    return;
  }
  const { rotateParams, rotateHandler, rotateAngle, rotateStyleUpdater } = rotateApplication;
  const lastRotateAngle = rotateAngle.total;
  const angle = rotateHandler.rotating(rotateParams.manualRotate + lastRotateAngle);
  if (!rotateAngle.angle) { return; }
  const rotateStyle = rotateStyleUpdater.setStyleRotate(angle);
  rotateApplication.updateRotate({ rotate: angle }, rotateStyle);
}
