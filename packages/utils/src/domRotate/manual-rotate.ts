import type { RotateApplication } from './rotate-core/rotate-application';

export function rotateByManual(rotateApplication: RotateApplication) {
  if (!rotateApplication.rotateParams.manualRotate) {
    return;
  }
  const { rotateParams, rotateHandler, rotateLogger, rotateStyleUpdater } = rotateApplication;
  const lastRotateAngle = rotateLogger.total;
  const angle = rotateHandler.rotating(rotateParams.manualRotate + lastRotateAngle);
  if (!rotateLogger.angle) { return; }
  const rotateStyle = rotateStyleUpdater.setStyleRotate(angle);
  rotateApplication.updateRotate({ rotate: angle }, rotateStyle);
}
