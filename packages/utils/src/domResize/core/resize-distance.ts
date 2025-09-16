import type { Axis } from '../typing';
import type { AxisParams } from './axis-params';
import type { DomAttrs } from './dom-attrs';

interface AxisDistance {
  /** 调整后的值 */
  value: number
  /** 总共调整的距离 */
  total: number
  /** 每次调整的距离 */
  distance: number
};

export class ResizeDistance {
  x: AxisDistance = {
    value: 0,
    total: 0,
    distance: 0,
  };

  y: AxisDistance = {
    value: 0,
    total: 0,
    distance: 0,
  };

  constructor(private axiosParams: AxisParams, private domAttrs: DomAttrs) {
    this.setDistance();
  };

  public updateResizeDistance() {
    if (this.domAttrs.isTargetAttrsUpdate) {
      this.setDistance();
    }
  };

  private setDistance() {
    this.x.value = this.domAttrs.width;
    this.y.value = this.domAttrs.height;
    this.x.total = 0;
    this.y.total = 0;
    this.x.distance = 0;
    this.y.distance = 0;
  };

  /** 记录每次的调整 */
  public logDistance(value: number, axis: Axis) {
    this[axis].distance = value - this[axis].value; // 减去上次的宽高，获取调整距离
    this[axis].value = value;
    this[axis].total = value > 0
      ? value - this.axiosParams[axis].originValue
      : value - this.axiosParams[axis].minValue; // 总共调整的距离
  };
}
