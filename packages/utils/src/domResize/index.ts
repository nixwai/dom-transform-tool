import type { DomResizeOptions } from './types';
import { resizeByManual } from './manual-resize';
import { resizeByPointer } from './pointer-resize';
import { ResizeApplication } from './resize-core/resize-application';

/**
 * 调节大小尺寸函数
 * @param options 配置项 - {@link DomResizeOptions}
 * @return 释放函数，调用该函数释放指针事件
 */
export function domResize(options?: DomResizeOptions) {
  const resizeApplication = new ResizeApplication(options);
  resizeByManual(resizeApplication);
  return resizeByPointer(resizeApplication);
}

export * from './types';
