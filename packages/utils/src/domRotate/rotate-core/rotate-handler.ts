import type { DomRotateOptions } from '../types';
import type { RotateLogger } from './rotate-logger';
import type { RotateParams } from './rotate-params';
import { getPrecisionValue } from '../../utils';

export class ResizeHandler {
  private getRotateValue = (value: number) => value;

  constructor(
    private options: DomRotateOptions,
    private rotateParams: RotateParams,
    private rotateLogger: RotateLogger,
  ) {
    this.createRotateValueMethod();
  }

  private createRotateValueMethod() {
    this.getRotateValue = this.options.step && this.options.step > 0
      ? (value: number) => Math.round(value / this.options.step!) * this.options.step!
      : (value: number) => value;
  }

  public rotating(value: number) {
    const { minValue, maxValue, originValue } = this.rotateParams;
    let rotateValue = this.getRotateValue(value);
    // 限制角度
    if (rotateValue < minValue) { rotateValue = minValue; }
    else if (rotateValue > maxValue) { rotateValue = maxValue; }
    // 加上原角度
    rotateValue = getPrecisionValue(rotateValue + originValue);
    this.rotateLogger.logAngle(rotateValue);
    return rotateValue;
  }
}
