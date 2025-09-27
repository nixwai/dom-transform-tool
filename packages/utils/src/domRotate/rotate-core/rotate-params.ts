import type { DomRotateOptions } from '../types';
import type { RotateDomAttrs } from './rotate-dom-attrs';
import { toNum } from '../../utils';

export class RotateParams {
  /** 手动调整的角度 */
  public manualRotate = 0;
  /** 原值 */
  public originValue = 0;
  /** 最小值 */
  public minValue = -Infinity;

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
    this.originValue = this.domRotateAttrs.variant.rotate;
  }
}
