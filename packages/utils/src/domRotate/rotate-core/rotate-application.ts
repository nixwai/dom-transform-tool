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

  // private cacheResizeContent: DomResizeContent = {};

  public updateRotate(content: DomRotateContent, styles: DomRotateStyle) {
    this.options.callback?.(content, styles);
  }
}
