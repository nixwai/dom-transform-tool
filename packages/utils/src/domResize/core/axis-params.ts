import type { DomResizeOptions } from '../types';
import type { DomAttrs } from './dom-attrs';
import type { ResizeDistance } from './resize-distance';

interface DirectionParams {
  /** 原值 */
  originValue: number
  /** 最小值 */
  minValue: number
  /** 最大调整距离 */
  maxDistance: number
  /** 最小调整距离 */
  minDistance: number
  /** 网格的移动距离 */
  gridDistance: number
  /** 手动调整的距离 */
  manualDistance: number
}

const DEFAULT_GRID = 0.5;

export class AxisParams {
  x: DirectionParams = {
    originValue: 0,
    minValue: 0,
    maxDistance: Infinity,
    minDistance: -Infinity,
    gridDistance: DEFAULT_GRID,
    manualDistance: 0,
  };

  y: DirectionParams = {
    originValue: 0,
    minValue: 0,
    maxDistance: Infinity,
    minDistance: -Infinity,
    gridDistance: DEFAULT_GRID,
    manualDistance: 0,
  };

  constructor(private options: DomResizeOptions, private domAttrs: DomAttrs, private resizeDistance: ResizeDistance) {
    this.setAxisParams();
  }

  public hasUpdate = false;
  public updateAxisParams(options: DomResizeOptions) {
    this.hasUpdate = Boolean(
      this.domAttrs.hasUpdate
      || this.options.direction !== options.direction
      || this.options.grid !== options.grid
      || this.options.lockAspectRatio !== options.lockAspectRatio
      || this.options.manual !== options.manual
      || Boolean(this.options.pointer) !== Boolean(options.pointer),
    );

    this.options = options;

    if (this.hasUpdate) {
      // 对比配置项，如果配置项有更新则重新计算参数
      this.setAxisParams();
    }
  }

  private setAxisParams() {
    const { width, height, parentWidth, parentHeight, aspectRatio, maxWidth, minWidth, maxHeight, minHeight } = this.domAttrs;    
    const manualDistanceX = this.resolveManualDistance(width, parentWidth, this.options.manual?.width);
    const manualDistanceY = this.resolveManualDistance(height, parentHeight, this.options.manual?.height);
    
    // 固定的移动距离，两边都移动时需要*2
    let gridX = (this.options.grid?.[0] || DEFAULT_GRID) * (this.resizeDistance.x.dir ? 1 : 2);
    let gridY = (this.options.grid?.[1] || DEFAULT_GRID) * (this.resizeDistance.y.dir ? 1 : 2);
    if (this.options.lockAspectRatio) {
      // 锁定宽高比时，固定的移动距离也会变化
      if (this.options.pointer || manualDistanceX) {
        gridY = gridX / aspectRatio;
      }
      else {
        gridX = gridY * aspectRatio;
      }
    }

    this.x = {
      originValue: width,
      minValue: width - Math.floor((width - minWidth) / gridX) * gridX,
      maxDistance: Math.floor((maxWidth - width) / gridX) * gridX,
      minDistance: Math.ceil((minWidth - width) / gridX) * gridX,
      gridDistance: gridX,
      manualDistance: manualDistanceX,
    };
    this.y = {
      originValue: height,
      minValue: height - Math.floor((height - minHeight) / gridY) * gridY,
      maxDistance: Math.floor((maxHeight - height) / gridY) * gridY,
      minDistance: Math.ceil((minHeight - height) / gridY) * gridY,
      gridDistance: gridY,
      manualDistance: manualDistanceY,
    };
  }

  /** 手动调整距离 */
  private resolveManualDistance(originValue: number, parentValue: number, optionManual?: number | string) {
    const manualValue = optionManual?.toString();
    let distance = 0;
    // 获取手动调整的偏移量
    if (manualValue) {
      distance = manualValue.includes('%')
        ? Number.parseFloat(manualValue) / 100 * parentValue
        : Number.parseFloat(manualValue);
      if (this.options.manual?.type === 'size') {
        // 调整到固定的大小
        distance = distance - originValue;
      }
    }
    return distance;
  }
}
