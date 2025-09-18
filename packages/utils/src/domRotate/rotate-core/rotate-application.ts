import type { DomRotateOptions } from '../types';
import { RotateDomAttrs } from './rotate-dom-attrs';

export class RotateApplication {
  public options: DomRotateOptions = {};

  public domRotateAttrs: RotateDomAttrs;

  constructor(options?: DomRotateOptions) {
    if (options) { this.options = options; }
    this.domRotateAttrs = new RotateDomAttrs(this.options);
  }
}
