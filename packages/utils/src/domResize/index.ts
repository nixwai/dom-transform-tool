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

  /**
   * 执行调整大小
   * @param options 配置项
   * @param recount 是否重置重新计算元素信息
   */
  handler(options: DomResizeOptions = {}, recount: boolean = false) {
    this.resizeApplication.updateInstance(options, recount);
    resizeByManual(this.resizeApplication);
    resizeByPointer(this.resizeApplication);
  }
}

export * from './helper';

export * from './types';
