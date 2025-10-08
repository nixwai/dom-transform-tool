import type { DragAxisParams } from './drag-axis-params';
import type { DragLogger } from './drag-logger';

export class DragHandler {
  constructor(
    private dragAxisParams: DragAxisParams,
    private dragLogger: DragLogger,
  ) {}

  /** 拖动 */
  public dragging(startLocation: number, endLocation: number, axis: 'x' | 'y') {
    const { gridDistance, originValue } = this.dragAxisParams[axis];
    const distance = Math.round((endLocation - startLocation) / gridDistance) * gridDistance;
    const dragValue = originValue + distance;
    this.dragLogger.logDistance(dragValue, axis);
    return dragValue;
  }
}
