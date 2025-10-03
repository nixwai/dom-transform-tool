import type { DomScaleOptions } from '../types';
import { DomVariant } from '../../base';
import { getDoubleValue } from '../../utils';

export class ScaleDomAttrs {
  /** 元素变化属性信息 */
  public variant = new DomVariant();
  /** 横轴原缩放值 */
  public originScaleX = 1;
  /** 纵轴原缩放值 */
  public originScaleY = 1;
  /** 横轴最小缩放值 */
  public minScaleX = -Infinity;
  /** 纵轴最小缩放值 */
  public minScaleY = -Infinity;
  /** 横轴最大缩放值 */
  public maxScaleX = Infinity;
  /** 纵轴最大缩放值 */
  public maxScaleY = Infinity;

  constructor(private options: DomScaleOptions) {
    this.updateTargetAttrsInfo();
    this.updateScaleInfo();
    this.customDomAttrs();
  }

  /** 更新目标属性信息 */
  private updateTargetAttrsInfo() {
    if (!this.options.target) { return; }
    const domStyles = window.getComputedStyle(this.options.target, null);
    this.variant.setTransform(domStyles);
    this.variant.setScale(domStyles);
  }

  /** 更新缩放信息 */
  private updateScaleInfo() {
    if (this.options.scaleType === 'transform') {
      this.originScaleX = this.variant.transformScaleX;
      this.originScaleY = this.variant.transformScaleY;
    }
    else {
      this.originScaleX = this.variant.styleScaleX;
      this.originScaleY = this.variant.styleScaleY;
    }
  }

  /** 自定义信息 */
  private customDomAttrs() {
    if (!this.options.customStyle) { return; }

    const { scale, maxScale, minScale } = this.options.customStyle;
    if (scale !== undefined) {
      const scales = getDoubleValue(scale);
      this.originScaleX = scales[0];
      this.originScaleY = scales[1];
    }

    if (maxScale !== undefined) {
      const maxScales = getDoubleValue(maxScale);
      this.maxScaleX = maxScales[0];
      this.maxScaleY = maxScales[1];
    }

    if (minScale !== undefined) {
      const minScales = getDoubleValue(minScale);
      this.minScaleX = minScales[0];
      this.minScaleY = minScales[1];
    }
  }
}
