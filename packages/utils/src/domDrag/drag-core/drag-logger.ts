import type { DragAxisParams } from './drag-axis-params';

interface DragDistance {
  /** 拖动后的偏移值 */
  value: number
  /** 总共拖动的距离 */
  total: number
  /** 每次拖动的距离 */
  distance: number
};

export class DragLogger {
  x: DragDistance = {
    value: 0,
    total: 0,
    distance: 0,
  };

  y: DragDistance = {
    value: 0,
    total: 0,
    distance: 0,
  };

  constructor(private dragAxisParams: DragAxisParams) {
    this.setDistance();
  };

  private setDistance() {
    this.x.value = this.dragAxisParams.x.originValue;
    this.y.value = this.dragAxisParams.y.originValue;
    this.x.total = 0;
    this.y.total = 0;
    this.x.distance = 0;
    this.y.distance = 0;
  };

  /** 记录每次的拖动 */
  public logDistance(value: number, axis: 'x' | 'y') {
    this[axis].distance = value - this[axis].value; // 减去上次的偏移值，获取拖动距离
    this[axis].value = value;
    this[axis].total = value - this.dragAxisParams[axis].originValue; // 总共拖动的距离
  };
}
