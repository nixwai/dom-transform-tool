import type { DomDragOptions } from '../types';
import type { DragDomAttrs } from './drag-dom-attrs';
import { getPctValue } from '../../utils';

interface DragDirectionParams {
  /** 原始位置 */
  originValue: number
  /** 网格的移动距离 */
  gridDistance: number
  /** 手动调整的距离 */
  manualDistance: number
}

const DEFAULT_GRID = 0.5;

export class DragAxisParams {
  x: DragDirectionParams = {
    originValue: 0,
    gridDistance: DEFAULT_GRID,
    manualDistance: 0,
  };

  y: DragDirectionParams = {
    originValue: 0,
    gridDistance: DEFAULT_GRID,
    manualDistance: 0,
  };

  constructor(private options: DomDragOptions, private dragDomAttrs: DragDomAttrs) {
    this.setManualDistance();
    this.setAxisParams();
  }

  private setManualDistance() {
    const { parentWidth, parentHeight } = this.dragDomAttrs.size;
    const manualDistanceX = this.resolveManualDistance(
      this.x.originValue,
      parentWidth,
      this.options.manual?.offsetX,
    );
    const manualDistanceY = this.resolveManualDistance(
      this.y.originValue,
      parentHeight,
      this.options.manual?.offsetY,
    );

    this.x.manualDistance = manualDistanceX;
    this.y.manualDistance = manualDistanceY;
  }

  private setAxisParams() {
    const { offsetX, offsetY } = this.dragDomAttrs;

    // 设置原始位置
    this.x.originValue = offsetX;
    this.y.originValue = offsetY;

    // 设置网格距离
    this.x.gridDistance = this.options.grid?.[0] ?? DEFAULT_GRID;
    this.y.gridDistance = this.options.grid?.[1] ?? DEFAULT_GRID;
  }

  /** 手动调整距离 */
  private resolveManualDistance(originValue: number, parentValue: number, optionManual?: number | string) {
    if (optionManual === undefined) {
      return 0;
    }
    const manualValue = optionManual.toString();
    let distance = 0;
    // 获取手动调整的偏移量
    if (manualValue) {
      distance = getPctValue(manualValue, parentValue);
      if (this.options.manual?.mode === 'absolute') {
        // 调整到固定的位置
        distance = distance - originValue;
      }
    }
    return distance;
  }
}
