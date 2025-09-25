import type { RotateAngle } from './rotate-angle';
import type { RotateParams } from './rotate-params';

export class ResizeHandler {
  constructor(
    private rotateParams: RotateParams,
    private rotateAngle: RotateAngle,
  ) {}

  public rotating(angle: number) {
    const { originValue, minValue } = this.rotateParams;
    let value = originValue + angle;
    if (value < minValue) {
      value = minValue;
    }
    this.rotateAngle.logAngle(value);
    return value;
  }
}
