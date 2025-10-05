import type { DomDragOptions } from '../types';
import type { DragLogger } from './drag-logger';
import type { DragParams } from './drag-params';

export class DragHandler {
  private getDragValue: (value: number, axis: 'x' | 'y') => number = () => 0;

  constructor(
    private options: DomDragOptions,
    private dragParams: DragParams,
    private dragLogger: DragLogger,
  ) {
    this.createDragValueMethod();
  }

  private createDragValueMethod() {
    this.getDragValue = this.options.offsetType
      ? (value: number) => value
      : (value: number) => value;
  }

  /** 拖动 */
  public dragging(startLocation: number, endLocation: number, axis: 'x' | 'y') {
    const {
      originOffsetX,
      originOffsetY,
      gridDistanceX,
      gridDistanceY,
      minOffsetX,
      minOffsetY,
      maxOffsetX,
      maxOffsetY,
    } = this.dragParams;

    const originValue = axis === 'x' ? originOffsetX : originOffsetY;
    const gridDistance = axis === 'x' ? gridDistanceX : gridDistanceY;
    const minValue = axis === 'x' ? minOffsetX : minOffsetY;
    const maxValue = axis === 'x' ? maxOffsetX : maxOffsetY;

    const distance = Math.round((endLocation - startLocation) / gridDistance) * gridDistance;
    const value = originValue + distance;
    const dragValue = this.getDragValue(value, axis);

    // 限制拖动范围
    const clampedValue = Math.max(minValue, Math.min(maxValue, dragValue));
    this.dragLogger.logDistance(clampedValue, axis);

    return clampedValue;
  }
}
