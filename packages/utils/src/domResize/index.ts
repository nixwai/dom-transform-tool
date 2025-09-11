import type { DomResizeOptions } from './types';
import { ResizeApplication } from './core/resize-application';
import { resizeByManual } from './manual-resize';
import { resizeByPointer } from './pointer-resize';

/**
 * 调节大小函数
 * @param options 配置项 - {@link DomResizeOptions}
 */
export function domResize(options?: DomResizeOptions) {
  const resizeApplication = new ResizeApplication(options);
  resizeByManual(resizeApplication);
  resizeByPointer(resizeApplication);
}

/**
 * 调整大小类
 */
export class DomResize {
  private resizeApplication: ResizeApplication;

  constructor(options?: DomResizeOptions) {
    this.resizeApplication = new ResizeApplication(options);
  }

  handler(options?: DomResizeOptions) {
    this.resizeApplication.updateInstance(options);
    resizeByManual(this.resizeApplication);
    resizeByPointer(this.resizeApplication);
  }
}

export * from './helper';

export * from './types';
