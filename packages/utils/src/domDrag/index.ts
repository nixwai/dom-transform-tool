import type { DomDragOptions } from './types';
import { DragApplication } from './drag-core/drag-application';
import { dragByManual } from './manual-drag';
import { dragByPointer } from './pointer-drag';

/**
 * 拖动元素函数
 * @param options 配置项 - {@link DomDragOptions}
 * @return 释放函数，调用该函数释放指针事件
 */
export function domDrag(options?: DomDragOptions) {
  const dragApplication = new DragApplication(options);

  dragByManual(dragApplication);
  return dragByPointer(dragApplication);
}

export * from './types';
