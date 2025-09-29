import type { DomRotateOptions } from '../types';
import type { RotateAngle } from './rotate-angle';
import type { RotateParams } from './rotate-params';

export class ResizeHandler {
  private getRotateValue = (value: number) => value;

  constructor(
    private options: DomRotateOptions,
    private rotateParams: RotateParams,
    private rotateAngle: RotateAngle,
  ) {
    this.createRotateValueMethod();
  }

  private createRotateValueMethod() {
    this.getRotateValue = this.options.step && this.options.step > 0
      ? (value: number) => Math.round(value / this.options.step!) * this.options.step!
      : (value: number) => value;
  }

  public rotating(angle: number) {
    const { minValue, maxValue, originValue } = this.rotateParams;
    let rotateValue = this.getRotateValue(angle);
    // 限制角度
    if (rotateValue < minValue) { rotateValue = minValue; }
    else if (rotateValue > maxValue) { rotateValue = maxValue; }
    // 加上原角度
    rotateValue += originValue;
    this.rotateAngle.logAngle(rotateValue);
    return rotateValue;
  }
}
