import type { DomResizeOptions } from '../types';
import type { Axis } from '../typing';
import type { DomAttrs } from './dom-attrs';

const valueMap = {
  x: 'width',
  y: 'height',
} as const;

interface AxisDistance {
  /** 调整后的值 */
  value: number
  /** 总共调整的距离 */
  total: number
  /** 每次调整的距离 */
  distance: number
  /** 移动方向，0：前后同时 1: 前方，-1: 后方 */
  dir: 0 | 1 | -1
};

export class ResizeDistance {
  x: AxisDistance = {
    value: 0,
    total: 0,
    distance: 0,
    dir: 0,
  };

  y: AxisDistance = {
    value: 0,
    total: 0,
    distance: 0,
    dir: 0,
  };

  constructor(private options: DomResizeOptions, private domAttrs: DomAttrs) {
    this.setDirection();
    this.setDistance();
  };

  public hasUpdate = false;
  public updateResizeDistance(options: DomResizeOptions) {
    this.hasUpdate = false;
    const taskList: [unknown, () => void][] = [
      [
        this.domAttrs.hasUpdate,
        this.setDistance,
      ],
      [
        options.direction !== this.options.direction,
        this.setDirection,
      ],
    ];
    this.options = options;
    taskList.forEach(([condition, fn]) => {
      if (condition) {
        this.hasUpdate = true;
        fn.call(this);
      }
    });
  };

  private setDistance() {
    this.x.value = this.domAttrs.width;
    this.y.value = this.domAttrs.height;
    this.x.total = 0;
    this.y.total = 0;
    this.x.distance = 0;
    this.y.distance = 0;
  };

  private setDirection() {
    const direction = this.options.direction || 'all';
    const hasLeft = direction.includes('left');
    const hasRight = direction.includes('right');
    const hasTop = direction.includes('top');
    const hasBottom = direction.includes('bottom');

    this.x.dir = hasLeft === hasRight ? 0 : (hasRight ? 1 : -1);
    this.y.dir = hasTop === hasBottom ? 0 : (hasBottom ? 1 : -1);
  };

  /** 记录每次的调整 */
  public logDistance(value: number, axis: Axis) {
    this[axis].distance = value - this[axis].value; // 减去上次的宽高，获取调整距离
    this[axis].total = value - this.domAttrs[valueMap[axis]]; // 总共调整的距离
    this[axis].value = value;
  };
}
