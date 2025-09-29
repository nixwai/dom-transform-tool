import type { DomResizeOptions } from '../types';
import type { ResizingFn } from './resize-application';
import type { ResizeAxisParams } from './resize-axis-params';
import type { ResizeDistance } from './resize-distance';
import type { ResizeDistanceCounter } from './resize-distance-counter';
import type { ResizeOffsetCounter } from './resize-offset-counter';

export class ResizeHandler {
  private getResizeValue: (value: number, minValue: number) => number = () => 0;

  constructor(
    private options: DomResizeOptions,
    private resizeAxisParams: ResizeAxisParams,
    private resizeDistanceCounter: ResizeDistanceCounter,
    private resizeOffsetCounter: ResizeOffsetCounter,
    private resizeDistance: ResizeDistance,
  ) {
    this.createResizeValueMethod();
  }

  private createResizeValueMethod() {
    this.getResizeValue = this.options.offsetType
      ? (value: number) => value
      : (value: number, minValue: number) => value > minValue ? value : minValue;
  }

  /** 向前调整（往右或者往下）长度与位移 */
  public resizingForward: ResizingFn = (startLocation, endLocation, axis) => {
    const { originValue, minValue } = this.resizeAxisParams[axis];
    const distance = this.resizeDistanceCounter.getDistance(startLocation, endLocation, axis, 1);
    const value = originValue + distance;
    const { offsetCurrentAxis, offsetAnotherAxis } = this.resizeOffsetCounter.getForwardOffset(distance, axis, 1, value);
    const resizeValue = this.getResizeValue(value, minValue);
    this.resizeDistance.logDistance(resizeValue, axis);
    return {
      value: Math.abs(resizeValue),
      offset: offsetCurrentAxis,
      otherOffset: offsetAnotherAxis,
    };
  };

  /** 向后调整（往左或者往上）长度与位移 */
  public resizingBackward: ResizingFn = (startLocation, endLocation, axis) => {
    const { originValue, minValue } = this.resizeAxisParams[axis];
    const distance = this.resizeDistanceCounter.getDistance(startLocation, endLocation, axis, -1);
    const value = originValue - distance;
    const { offsetCurrentAxis, offsetAnotherAxis } = this.resizeOffsetCounter.getBackwardOffset(distance, axis, -1, value);
    const resizeValue = this.getResizeValue(value, minValue);
    this.resizeDistance.logDistance(resizeValue, axis);
    return {
      value: Math.abs(resizeValue),
      offset: offsetCurrentAxis,
      otherOffset: offsetAnotherAxis,
    };
  };

  /** 前后一起调整(上下或者左右)长度与位移 */
  public resizingBoth: ResizingFn = (startLocation, endLocation, axis, pointerDir = 1) => {
    const { originValue, minValue } = this.resizeAxisParams[axis];
    // 两边一起调整时需要对数据翻倍
    const distance = this.resizeDistanceCounter.getDistance(2 * startLocation, 2 * endLocation, axis, pointerDir);
    const value = originValue + pointerDir * distance;
    const { offsetCurrentAxis, offsetAnotherAxis } = this.resizeOffsetCounter.getBothOffset(distance, axis, pointerDir, value);
    const resizeValue = this.getResizeValue(value, minValue);
    this.resizeDistance.logDistance(resizeValue, axis);
    return {
      value: Math.abs(resizeValue),
      offset: offsetCurrentAxis,
      otherOffset: offsetAnotherAxis,
    };
  };
}
