import type { ScaleApplication } from './scale-core/scale-application';

export function scaleByManual(scaleApplication: ScaleApplication) {
  if (!scaleApplication.scaleAxisParams.x.manualValue && !scaleApplication.scaleAxisParams.y.manualValue) {
    return;
  }
  if (scaleApplication.options.direction === 'x') {
    scaleAxisX(scaleApplication);
  }
  else if (scaleApplication.options.direction === 'y') {
    scaleAxisY(scaleApplication);
  }
  else {
    scaleAll(scaleApplication);
  }
}

/** 缩放水平方向 */
function scaleAxisX(scaleApplication: ScaleApplication) {
  const { scaleAxisParams, scaleHandler, scaleLogger, scaleStyleUpdater } = scaleApplication;
  const lastScaleX = scaleLogger.x.total;
  const scaleX = scaleHandler.scaling(scaleAxisParams.x.manualValue + lastScaleX, 'x');
  const scaleY = scaleLogger.y.value;
  if (!scaleLogger.x.ratio) { return; }
  const rotateStyle = scaleStyleUpdater.setStyleRotate(scaleX, scaleY);
  scaleApplication.updateRotate({ scaleX, scaleY }, rotateStyle);
}

/** 缩放垂直方向 */
function scaleAxisY(scaleApplication: ScaleApplication) {
  const { scaleAxisParams, scaleHandler, scaleLogger, scaleStyleUpdater } = scaleApplication;
  const lastScaleY = scaleLogger.y.total;
  const scaleX = scaleLogger.x.value;
  const scaleY = scaleHandler.scaling(scaleAxisParams.y.manualValue + lastScaleY, 'y');
  if (!scaleLogger.y.ratio) { return; }
  const rotateStyle = scaleStyleUpdater.setStyleRotate(scaleX, scaleY);
  scaleApplication.updateRotate({ scaleX, scaleY }, rotateStyle);
}

/** 缩放水平与垂直方向 */
function scaleAll(scaleApplication: ScaleApplication) {
  const { scaleAxisParams, scaleHandler, scaleLogger, scaleStyleUpdater } = scaleApplication;
  const lastScaleX = scaleLogger.x.total;
  const lastScaleY = scaleLogger.y.total;
  const scaleX = scaleHandler.scaling(scaleAxisParams.x.manualValue + lastScaleX, 'x');
  const scaleY = scaleHandler.scaling(scaleAxisParams.y.manualValue + lastScaleY, 'y');
  if (!scaleLogger.x.ratio && !scaleLogger.y.ratio) { return; }
  const rotateStyle = scaleStyleUpdater.setStyleRotate(scaleX, scaleY);
  scaleApplication.updateRotate({ scaleX, scaleY }, rotateStyle);
}
