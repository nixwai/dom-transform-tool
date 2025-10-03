import type { DomScaleContent, DomScaleOptions, DomScaleStyle } from '../types';
import { ScaleAxisParams } from './scale-axis-params';
import { ScaleDomAttrs } from './scale-dom-attrs';
import { ScaleHandler } from './scale-handler';
import { ScaleLogger } from './scale-logger';
import { ScaleStyleUpdater } from './scale-style-updater';

export class ScaleApplication {
  public options: DomScaleOptions = {};
  public scaleDomAttrs: ScaleDomAttrs;
  public scaleAxisParams: ScaleAxisParams;
  public scaleLogger: ScaleLogger;
  public scaleStyleUpdater: ScaleStyleUpdater;
  public scaleHandler: ScaleHandler;

  constructor(options?: DomScaleOptions) {
    if (options) { this.options = options; }
    this.scaleDomAttrs = new ScaleDomAttrs(this.options);
    this.scaleAxisParams = new ScaleAxisParams(this.options, this.scaleDomAttrs);
    this.scaleLogger = new ScaleLogger(this.scaleAxisParams);
    this.scaleStyleUpdater = new ScaleStyleUpdater(this.options, this.scaleDomAttrs);
    this.scaleHandler = new ScaleHandler(this.scaleAxisParams, this.scaleLogger);
  }

  public updateScale(content: DomScaleContent, styles: DomScaleStyle) {
    this.options.callback?.(content, styles);
  }
}
