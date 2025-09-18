import type { DomResizeOptions } from '../types';
import type { Axis, Dir } from '../typing';
import type { ResizeAxisParams } from './resize-axis-params';

export class ResizeDistanceCounter {
  /** 获取移动距离 */
  public getDistance: (startLocation: number, endLocation: number, axis: Axis, dir: Dir) => number = () => 0;

  constructor(private options: DomResizeOptions, private resizeAxisParams: ResizeAxisParams) {
    this.createGetDistanceMethod();
  }

  /** 初始化移动距离方法 */
  private createGetDistanceMethod() {
    if (this.options.crossAxis) {
      this.getDistance = (startLocation: number, endLocation: number, axis: Axis, dir: Dir) => {
        const { maxDistance, minDistance, gridDistance } = this.resizeAxisParams[axis];
        const distance = Math.round((endLocation - startLocation) / gridDistance) * gridDistance;
        const dis = distance * dir;
        if (dis < minDistance) {
          let targetDis = distance - dir * this.resizeAxisParams[axis].minCrossDis;
          if (-dir * targetDis > this.resizeAxisParams[axis].maxCrossDis) {
            targetDis = -dir * this.resizeAxisParams[axis].maxCrossDis;
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
        const { maxDistance, minDistance, gridDistance } = this.resizeAxisParams[axis];
        const distance = Math.round((endLocation - startLocation) / gridDistance) * gridDistance;
        const dis = distance * dir;
        if (dis < minDistance) { return minDistance * dir; }
        if (dis > maxDistance) { return maxDistance * dir; }
        return distance;
      };
    }
  }
}
