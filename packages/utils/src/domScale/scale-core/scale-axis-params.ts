import type { DomScaleOptions } from '../types';
import type { ScaleDomAttrs } from './scale-dom-attrs';
import { getDoubleValue } from '../../utils';

interface RatioParams {
  /** 原值 */
  originValue: number
  /** 最大调整比例 */
  maxValue: number
  /** 最小调整比例 */
  minValue: number
  /** 手动调整的距离 */
  manualValue: number
}

export class ScaleAxisParams {
  x: RatioParams = {
    originValue: 1,
    minValue: -Infinity,
    maxValue: Infinity,
    manualValue: 0,
  };

  y: RatioParams = {
    originValue: 1,
    minValue: -Infinity,
    maxValue: Infinity,
    manualValue: 0,
  };

  constructor(private options: DomScaleOptions, private scaleDomAttrs: ScaleDomAttrs) {
    this.setManualValue();
    this.setAxisParams();
  }

  private setManualValue() {
    if (this.options.manual?.scale !== undefined) {
      const { scaleX, scaleY } = this.scaleDomAttrs.variant;
      const manualScale = getDoubleValue(this.options.manual.scale);
      this.x.manualValue = this.resolveManualValue(scaleX, manualScale[0]);
      this.y.manualValue = this.resolveManualValue(scaleY, manualScale[1]);
    }
    else {
      this.x.manualValue = 0;
      this.y.manualValue = 0;
    }
  }

  private setAxisParams() {
    const { originScaleX, originScaleY, minScaleX, maxScaleX, minScaleY, maxScaleY, variant } = this.scaleDomAttrs;

    this.x.originValue = originScaleX;
    this.x.maxValue = maxScaleX - variant.scaleX;
    this.x.minValue = minScaleX - variant.scaleX;

    this.y.originValue = originScaleY;
    this.y.maxValue = maxScaleY - variant.scaleY;
    this.y.minValue = minScaleY - variant.scaleY;
  }

  /** 手动调整距离 */
  private resolveManualValue(originValue: number, manualValue: number) {
    let result = manualValue;
    if (this.options.manual?.mode === 'absolute') {
      // 调整到固定的比例
      result = result - originValue;
    }
    return result;
  }
}
