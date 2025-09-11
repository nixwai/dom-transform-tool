import type { DomResizeOptions } from '../types';
import type { Axis, Dir } from '../typing';
import type { AxisParams } from './axis-params';
import type { DomAttrs } from './dom-attrs';

export class DistanceCounter {
  /** 获取移动距离 */
  public getDistance: (startLocation: number, endLocation: number, axis: Axis, dir: Dir) => number = () => 0;

  constructor(private options: DomResizeOptions, private domAttrs: DomAttrs, private axisParams: AxisParams) {
    this.createGetDistanceMethod();
  }

  public updateDistanceCounter(options: DomResizeOptions) {
    const hasUpdate = Boolean(
      options.crossAxis !== this.options.crossAxis || this.domAttrs.hasUpdate || this.axisParams.hasUpdate,
    );

    this.options = options;

    if (hasUpdate) {
      this.createGetDistanceMethod();
    }
  }

  /** 初始化移动距离方法 */
  private createGetDistanceMethod() {
    const { width, height, maxWidth } = this.domAttrs;
    if (this.options.crossAxis) {
      // 允许越轴调整
      const minCrossDis = {
        x: 2 * this.axisParams.x.minValue,
        y: 2 * this.axisParams.y.minValue,
      };
      const maxCrossDis = {
        x: Math.floor((maxWidth + width) / this.axisParams.x.gridDistance) * this.axisParams.x.gridDistance,
        y: Math.floor((maxWidth + height) / this.axisParams.y.gridDistance) * this.axisParams.y.gridDistance,
      };
      this.getDistance = (startLocation: number, endLocation: number, axis: Axis, dir: Dir) => {
        const { maxDistance, minDistance, gridDistance } = this.axisParams[axis];
        const distance = Math.round((endLocation - startLocation) / gridDistance) * gridDistance;
        const dis = distance * dir;
        if (dis < minDistance) {
          let targetDis = distance - dir * minCrossDis[axis];
          if (-dir * targetDis > maxCrossDis[axis]) {
            targetDis = -dir * maxCrossDis[axis];
          }
          return targetDis;
        }
        if (dis > maxDistance) { return maxDistance * dir; }
        return distance;
      };
    }
    else {
      // 不可以越轴调整
      this.getDistance = (startLocation: number, endLocation: number, axis: Axis, dir: Dir) => {
        const { maxDistance, minDistance, gridDistance } = this.axisParams[axis];
        const distance = Math.round((endLocation - startLocation) / gridDistance) * gridDistance;
        const dis = distance * dir;
        if (dis < minDistance) { return minDistance * dir; }
        if (dis > maxDistance) { return maxDistance * dir; }
        return distance;
      };
    }
  }
}
