import type { DomRotateOptions } from './types';
import { rotateByManual } from './manual-rotate';
import { rotateByPointer } from './pointer-rotate';
import { RotateApplication } from './rotate-core/rotate-application';

export function domRotate(options?: DomRotateOptions) {
  const rotateApplication = new RotateApplication(options);

  rotateByManual(rotateApplication);
  rotateByPointer(rotateApplication);
}
