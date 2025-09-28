import type { DomRotateOptions } from '../types';
import type { RotateDomAttrs } from './rotate-dom-attrs';
import { toNum } from '../../utils';

export class RotateParams {
  /** 手动调整的角度 */
  public manualRotate = 0;
  /** 原角度值 */
  public originValue = 0;
  /** 最小可调整的角度值 */
  public minValue = -Infinity;
  /** 最大可调整的角度值 */
  public maxValue = Infinity;

  constructor(private options: DomRotateOptions, private domRotateAttrs: RotateDomAttrs) {
    this.setManualDeg();
    this.setParams();
  }

  private setManualDeg() {
    const manualValue = this.options.manual?.rotate?.toString();
    let rotateDeg = 0;
    if (manualValue) {
      rotateDeg = toNum(manualValue);
      if (this.options.manual?.mode === 'absolute') {
        // 调整到固定的角度
        rotateDeg = rotateDeg - this.domRotateAttrs.variant.rotate;
      }
    }
    this.manualRotate = rotateDeg;
  }

  private setParams() {
    const { variant, maxRotate, minRotate } = this.domRotateAttrs;
    this.originValue = variant.rotate % 180;
    const step = this.options.step;
    if (step && step > 0) {
      this.minValue = Math.ceil((minRotate - this.originValue) / step) * step;
      this.maxValue = Math.floor((maxRotate - this.originValue) / step) * step;
    }
    else {
      this.minValue = minRotate - this.originValue;
      this.maxValue = maxRotate - this.originValue;
    }
  }
}
