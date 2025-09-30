import type { DomRotateContent, DomRotateOptions, DomRotateStyle } from '../types';
import { RotateDomAttrs } from './rotate-dom-attrs';
import { ResizeHandler } from './rotate-handler';
import { RotateLogger } from './rotate-logger';
import { RotateParams } from './rotate-params';
import { RotateStyleUpdater } from './rotate-style-updater';

export class RotateApplication {
  public options: DomRotateOptions = {};
  public rotateDomAttrs: RotateDomAttrs;
  public rotateParams: RotateParams;
  public rotateLogger: RotateLogger;
  public rotateStyleUpdater: RotateStyleUpdater;
  public rotateHandler: ResizeHandler;

  constructor(options?: DomRotateOptions) {
    if (options) { this.options = options; }
    this.rotateDomAttrs = new RotateDomAttrs(this.options);
    this.rotateParams = new RotateParams(this.options, this.rotateDomAttrs);
    this.rotateLogger = new RotateLogger(this.rotateDomAttrs);
    this.rotateStyleUpdater = new RotateStyleUpdater(this.options, this.rotateDomAttrs);
    this.rotateHandler = new ResizeHandler(this.options, this.rotateParams, this.rotateLogger);
  }

  /** 清除配置的指针 */
  public clearPointer() {
    this.options.pointer = undefined;
  }

  private cacheResizeContent: DomRotateContent = {};

  public updateRotate(content: DomRotateContent, styles: DomRotateStyle) {
    this.cacheResizeContent = content;
    this.options.callback?.(content, styles);
  }

  /** 指针活动开始 */
  public onPointerBegin() {
    this.cacheResizeContent = { rotate: this.rotateDomAttrs.originRotate };
    this.options.onPointerBegin?.(this.cacheResizeContent);
  }

  /** 指针活动 */
  public onPointerMove() {
    this.options.onPointerMove?.(this.cacheResizeContent);
  }

  /** 指针活动结束 */
  public onPointerEnd() {
    this.options.onPointerEnd?.(this.cacheResizeContent);
  }
}
