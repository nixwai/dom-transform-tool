import type { Axis } from '../../typing';
import type { ScaleAxisParams } from './scale-axis-params';
import type { ScaleLogger } from './scale-logger';
import { getPrecisionValue } from '../../utils';

export class ScaleHandler {
  constructor(
    private scaleAxisParams: ScaleAxisParams,
    private scaleLogger: ScaleLogger,
  ) {}

  public scaling(value: number, axis: Axis) {
    const { minValue, maxValue, originValue } = this.scaleAxisParams[axis];
    let scaleValue = value;
    // 限制缩放
    if (scaleValue < minValue) { scaleValue = minValue; }
    else if (scaleValue > maxValue) { scaleValue = maxValue; }
    scaleValue = getPrecisionValue(scaleValue + originValue);
    this.scaleLogger.logRatio(scaleValue, axis);
    return scaleValue;
  }
}
