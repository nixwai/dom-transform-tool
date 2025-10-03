import type { Axis } from '../../typing';
import type { ScaleAxisParams } from './scale-axis-params';

interface AxisScale {
  /** 缩放后的值 */
  value: number
  /** 总共缩放值 */
  total: number
  /** 每次缩放值 */
  ratio: number
};

export class ScaleLogger {
  x: AxisScale = {
    value: 0,
    total: 0,
    ratio: 0,
  };

  y: AxisScale = {
    value: 0,
    total: 0,
    ratio: 0,
  };

  constructor(private scaleAxisParams: ScaleAxisParams) {
    this.setRatio();
  }

  private setRatio() {
    this.x.value = this.scaleAxisParams.x.originValue;
    this.y.value = this.scaleAxisParams.y.originValue;
    this.x.total = 0;
    this.y.total = 0;
    this.x.ratio = 0;
    this.y.ratio = 0;
  };

  /** 记录每次的调整的比例 */
  public logRatio(value: number, axis: Axis) {
    this[axis].ratio = value - this[axis].value;
    this[axis].total = value - this.scaleAxisParams[axis].originValue;
    this[axis].value = value;
  };
}
