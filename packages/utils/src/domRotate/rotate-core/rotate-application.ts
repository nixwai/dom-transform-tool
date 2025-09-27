import type { DomRotateContent, DomRotateOptions, DomRotateStyle } from '../types';
import { RotateAngle } from './rotate-angle';
import { RotateDomAttrs } from './rotate-dom-attrs';
import { ResizeHandler } from './rotate-handler';
import { RotateParams } from './rotate-params';
import { RotateStyleUpdater } from './rotate-style-updater';

export class RotateApplication {
  public options: DomRotateOptions = {};
  public rotateDomAttrs: RotateDomAttrs;
  public rotateParams: RotateParams;
  public rotateAngle: RotateAngle;
  public rotateStyleUpdater: RotateStyleUpdater;
  public rotateHandler: ResizeHandler;

  constructor(options?: DomRotateOptions) {
    if (options) { this.options = options; }
    this.rotateDomAttrs = new RotateDomAttrs(this.options);
    this.rotateParams = new RotateParams(this.options, this.rotateDomAttrs);
    this.rotateAngle = new RotateAngle(this.rotateParams, this.rotateDomAttrs);
    this.rotateStyleUpdater = new RotateStyleUpdater(this.options);
    this.rotateHandler = new ResizeHandler(this.rotateParams, this.rotateAngle);
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
    this.cacheResizeContent = { rotate: this.rotateDomAttrs.variant.rotate };
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
