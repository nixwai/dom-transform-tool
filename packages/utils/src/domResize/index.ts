import type { DomResizeOptions } from './types';
import { initResize } from './core';
import { resizeByManual } from './manual-resize';
import { resizeByPointer } from './pointer-resize';

/**
 * 调整容器
 * @param options 配置项 - {@link DomResizeOptions}
 */
export function domResize(options: DomResizeOptions) {
  if (!options.target || !options.direction) { return; }
  const resizeData = initResize(options);
  resizeByManual(resizeData);
  resizeByPointer(resizeData);
}

export * from './types';
