import type { RotateApplication } from './rotate-core/rotate-application';

export function rotateByManual(rotateApplication: RotateApplication) {
  const { options, domRotateAttrs } = rotateApplication;
  const { manual } = options;
  if (!manual) { return; }
  const { mode, rotate } = manual;
  const rotateParams = new RotateParams(options, domRotateAttrs);
  if (mode === 'relative') {
    rotateParams.setManualDeg();
  }
  else {}
}
