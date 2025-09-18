import type { DomRotateOptions } from '../types';
import { DomVariant } from '../../base';

export class RotateDomAttrs {
  public variant = new DomVariant();

  constructor(private options: DomRotateOptions) {
    this.updateTargetAttrsInfo();
  }

  /** 更新目标属性信息 */
  private updateTargetAttrsInfo() {
    if (!this.options.target) { return; }
    const domStyles = window.getComputedStyle(this.options.target, null);
    this.variant.setTransform(domStyles);
    this.variant.setRotate(domStyles);
    this.variant.setTransformOrigin(domStyles, this.options.target?.style?.transformOrigin);
  }
}
