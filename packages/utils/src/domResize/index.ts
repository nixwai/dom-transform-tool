import type { DomResizeOptions } from './types';
import { resizeByManual } from './manual-resize';
import { resizeByPointer } from './pointer-resize';
import { ResizeApplication } from './resize-core/resize-application';

/**
 * 调节大小函数
 * @param options 配置项 - {@link DomResizeOptions}
 */
export function domResize(options?: DomResizeOptions) {
  const resizeApplication = new ResizeApplication(options);
  resizeByManual(resizeApplication);
  return resizeByPointer(resizeApplication);
}

export * from './helpers';

export * from './types';
