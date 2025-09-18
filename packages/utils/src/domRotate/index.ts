import type { DomRotateOptions } from './types';
import { RotateApplication } from './rotate-core/rotate-application';

export function domRotate(options?: DomRotateOptions) {
  const rotateApplication = new RotateApplication(options);
}
