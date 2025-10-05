import type { DomDragDirection, DomDragOptions } from '../types';
import type { DragDomAttrs } from './drag-dom-attrs';
import { getPctValue } from '../../utils';

interface IDragParams {
  /** 原值 */
  originOffsetX: number
  originOffsetY: number
  /** 最小偏移值 */
  minOffsetX: number
  minOffsetY: number
  /** 最大偏移值 */
  maxOffsetX: number
  maxOffsetY: number
  /** 手动调整的偏移值 */
  manualOffsetX: number
  manualOffsetY: number
  /** 网格的移动距离 */
  gridDistanceX: number
  gridDistanceY: number
  /** 移动方向 */
  direction: DomDragDirection
}

export class DragParams {
  private params: IDragParams = {
    originOffsetX: 0,
    originOffsetY: 0,
    minOffsetX: -Infinity,
    minOffsetY: -Infinity,
    maxOffsetX: Infinity,
    maxOffsetY: Infinity,
    manualOffsetX: 0,
    manualOffsetY: 0,
    gridDistanceX: 0.5,
    gridDistanceY: 0.5,
    direction: 'all',
  };

  constructor(private options: DomDragOptions, private dragDomAttrs: DragDomAttrs) {
    this.setManualOffset();
    this.setParams();
  }

  get originOffsetX() { return this.params.originOffsetX; }
  get originOffsetY() { return this.params.originOffsetY; }
  get minOffsetX() { return this.params.minOffsetX; }
  get minOffsetY() { return this.params.minOffsetY; }
  get maxOffsetX() { return this.params.maxOffsetX; }
  get maxOffsetY() { return this.params.maxOffsetY; }
  get manualOffsetX() { return this.params.manualOffsetX; }
  get manualOffsetY() { return this.params.manualOffsetY; }
  get gridDistanceX() { return this.params.gridDistanceX; }
  get gridDistanceY() { return this.params.gridDistanceY; }
  get direction() { return this.params.direction; }

  private setManualOffset() {
    const { parentWidth, parentHeight } = this.dragDomAttrs.size;
    const manualOffsetX = this.resolveManualOffset(parentWidth, this.options.manual?.offsetX);
    const manualOffsetY = this.resolveManualOffset(parentHeight, this.options.manual?.offsetY);

    this.params.manualOffsetX = manualOffsetX;
    this.params.manualOffsetY = manualOffsetY;
  }

  private setParams() {
    const { offsetX, offsetY } = this.dragDomAttrs;

    // 设置原偏移值
    this.params.originOffsetX = offsetX;
    this.params.originOffsetY = offsetY;

    // 设置网格距离
    this.params.gridDistanceX = this.options.grid?.[0] ?? 0.5;
    this.params.gridDistanceY = this.options.grid?.[1] ?? 0.5;

    // 设置方向
    this.params.direction = this.options.direction || 'all';

    // TODO: 可以添加更多限制逻辑，例如元素不能拖出父容器等
  }

  /** 手动调整偏移值 */
  private resolveManualOffset(parentValue: number, optionManual?: number | string) {
    if (optionManual === undefined) {
      return 0;
    }
    const manualValue = optionManual.toString();
    let offset = 0;
    // 获取手动调整的偏移量
    if (manualValue) {
      offset = getPctValue(manualValue, parentValue);
      if (this.options.manual?.mode === 'absolute') {
        // 调整到固定的位置
        offset = offset - this.dragDomAttrs.offsetX;
      }
    }
    return offset;
  }
}
