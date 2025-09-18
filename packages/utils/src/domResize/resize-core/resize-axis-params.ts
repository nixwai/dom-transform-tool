import type { DomResizeOptions } from '../types';
import type { ResizeDomAttrs } from './resize-dom-attrs';
import { getPctValue } from '../../utils';

interface DirectionParams {
  /** 原值 */
  originValue: number
  /** 最小值 */
  minValue: number
  /** 最大调整距离 */
  maxDistance: number
  /** 最小调整距离 */
  minDistance: number
  /** 最小调整距离（可越轴） */
  minCrossDis: number
  /** 最大调整距离（可越轴） */
  maxCrossDis: number
  /** 网格的移动距离 */
  gridDistance: number
  /** 手动调整的距离 */
  manualDistance: number
  /** 移动方向，0：前后同时 1: 前方，-1: 后方 */
  dir: 0 | 1 | -1
}

const DEFAULT_GRID = 0.5;

export class ResizeAxisParams {
  x: DirectionParams = {
    originValue: 0,
    minValue: 0,
    maxDistance: Infinity,
    minDistance: -Infinity,
    maxCrossDis: Infinity,
    minCrossDis: -Infinity,
    gridDistance: DEFAULT_GRID,
    manualDistance: 0,
    dir: 0,
  };

  y: DirectionParams = {
    originValue: 0,
    minValue: 0,
    maxDistance: Infinity,
    minDistance: -Infinity,
    maxCrossDis: Infinity,
    minCrossDis: -Infinity,
    gridDistance: DEFAULT_GRID,
    manualDistance: 0,
    dir: 0,
  };

  constructor(private options: DomResizeOptions, private resizeDomAttrs: ResizeDomAttrs) {
    this.setManualDistance();
    this.setDirection();
    this.setAxisParams();
  }

  private setManualDistance() {
    const { width, height, parentWidth, parentHeight } = this.resizeDomAttrs.size;
    const manualDistanceX = this.resolveManualDistance(width, parentWidth, this.options.manual?.width);
    const manualDistanceY = this.resolveManualDistance(height, parentHeight, this.options.manual?.height);

    const hasChange = manualDistanceX !== this.x.manualDistance || manualDistanceY !== this.y.manualDistance;
    this.x.manualDistance = manualDistanceX;
    this.y.manualDistance = manualDistanceY;

    return hasChange;
  }

  private setDirection() {
    const direction = this.options.direction || 'all';
    const hasLeft = direction.includes('left');
    const hasRight = direction.includes('right');
    const hasTop = direction.includes('top');
    const hasBottom = direction.includes('bottom');

    this.x.dir = hasLeft === hasRight ? 0 : (hasRight ? 1 : -1);
    this.y.dir = hasTop === hasBottom ? 0 : (hasBottom ? 1 : -1);
  };

  private setAxisParams() {
    const { width, height, aspectRatio, maxWidth, minWidth, maxHeight, minHeight } = this.resizeDomAttrs.size;
    // 固定的移动距离，两边都移动时需要*2
    let gridX = (this.options.grid?.[0] || DEFAULT_GRID) * (this.x.dir ? 1 : 2);
    let gridY = (this.options.grid?.[1] || DEFAULT_GRID) * (this.y.dir ? 1 : 2);
    if (this.options.lockAspectRatio) {
      // 锁定宽高比时，固定的移动距离也会变化
      if (this.options.pointer || this.options.manual?.width) {
        gridY = gridX / aspectRatio;
      }
      else {
        gridX = gridY * aspectRatio;
      }
    }

    this.x.originValue = width;
    this.x.minValue = width - Math.floor((width - minWidth) / gridX) * gridX;
    this.x.maxDistance = Math.floor((maxWidth - width) / gridX) * gridX;
    this.x.minDistance = Math.ceil((minWidth - width) / gridX) * gridX;
    this.x.maxCrossDis = Math.floor((maxWidth + width) / gridX) * gridX;
    this.x.minCrossDis = 2 * this.x.minValue;
    this.x.gridDistance = gridX;

    this.y.originValue = height;
    this.y.minValue = height - Math.floor((height - minHeight) / gridY) * gridY;
    this.y.maxDistance = Math.floor((maxHeight - height) / gridY) * gridY;
    this.y.minDistance = Math.ceil((minHeight - height) / gridY) * gridY;
    this.y.maxCrossDis = Math.floor((maxHeight + height) / gridY) * gridY;
    this.y.minCrossDis = 2 * this.y.minValue;
    this.y.gridDistance = gridY;
  }

  /** 手动调整距离 */
  private resolveManualDistance(originValue: number, parentValue: number, optionManual?: number | string) {
    const manualValue = optionManual?.toString();
    let distance = 0;
    // 获取手动调整的偏移量
    if (manualValue) {
      distance = getPctValue(manualValue, parentValue);
      if (this.options.manual?.type === 'size') {
        // 调整到固定的大小
        distance = distance - originValue;
      }
    }
    return distance;
  }
}
