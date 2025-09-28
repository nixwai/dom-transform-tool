import type { DomRotateOptions } from '../types';
import { DomVariant } from '../../base';
import { toNum } from '../../utils';

export class RotateDomAttrs {
  /** 元素变化属性信息 */
  public variant = new DomVariant();
  /** 元素的高 */
  public domHeight = 0;
  /** 最小旋转值 */
  public minRotate = -Infinity;
  /** 最大旋转值 */
  public maxRotate = Infinity;

  constructor(private options: DomRotateOptions) {
    this.updateTargetAttrsInfo();
    this.customDomAttrs();
  }

  /** 更新目标属性信息 */
  private updateTargetAttrsInfo() {
    if (!this.options.target) { return; }
    const domStyles = window.getComputedStyle(this.options.target, null);
    this.variant.setTransform(domStyles);
    this.variant.setRotate(domStyles);
    this.variant.setTransformOrigin(domStyles);
    this.domHeight = toNum(domStyles.height);
  }

  /** 自定义信息 */
  private customDomAttrs() {
    if (!this.options.customStyle) { return; }

    const { rotate, maxRotate, minRotate } = this.options.customStyle;
    if (rotate !== undefined) {
      this.variant.rotate = toNum(String(rotate));
    }

    if (minRotate !== undefined) {
      this.minRotate = toNum(String(minRotate));
    }

    if (maxRotate !== undefined) {
      this.maxRotate = toNum(String(maxRotate));
    }
  }
}
