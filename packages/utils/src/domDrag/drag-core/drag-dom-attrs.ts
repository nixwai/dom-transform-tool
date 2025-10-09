import type { DomDragOptions } from '../types';
import { DomSize, DomVariant } from '../../base';
import { getPctValue } from '../../utils';

export class DragDomAttrs {
  /** 水平偏移值 */
  offsetX: number = 0;
  /** 垂直偏移值 */
  offsetY: number = 0;

  public variant = new DomVariant();
  public size = new DomSize();

  constructor(private options: DomDragOptions) {
    this.updateTargetAttrsInfo();
    this.updateOffsetInfo();
    this.customDomAttrs();
  }

  /** 更新目标属性信息 */
  private updateTargetAttrsInfo() {
    if (!this.options.target) { return; }
    const domStyles = window.getComputedStyle(this.options.target, null);
    const parentStyles = window.getComputedStyle(this.options.target.parentNode as HTMLElement, null);
    this.size.setSizeInfo(domStyles, parentStyles);
    this.variant.setTransform(domStyles);
    this.variant.setPosition(domStyles);
    this.variant.setTranslate(domStyles);
  }

  /** 更新偏移信息 */
  private updateOffsetInfo() {
    if (this.options.offsetType === 'transform') {
      if (this.variant.transformValue.length > 6) {
        this.offsetX = this.variant.transformValue[12];
        this.offsetY = this.variant.transformValue[13];
      }
      else {
        this.offsetX = this.variant.transformValue[4];
        this.offsetY = this.variant.transformValue[5];
      }
    }
    else if (this.options.offsetType === 'position') {
      this.offsetX = this.variant.positionLeft;
      this.offsetY = this.variant.positionTop;
    }
    else {
      this.offsetX = this.variant.translateX;
      this.offsetY = this.variant.translateY;
    }
  }

  /** 自定义信息 */
  private customDomAttrs() {
    if (!this.options.customStyle) { return; }

    const { parentWidth, parentHeight, width, height, offsetX, offsetY } = this.options.customStyle;

    if (parentWidth !== undefined) {
      this.size.parentWidth = parentWidth;
    }
    if (parentHeight !== undefined) {
      this.size.parentHeight = parentHeight;
    }
    if (width !== undefined) {
      this.size.width = getPctValue(String(width), this.size.parentWidth);
    }
    if (height !== undefined) {
      this.size.height = getPctValue(String(height), this.size.parentHeight);
    }
    if (offsetX !== undefined) {
      this.offsetX = getPctValue(String(offsetX), this.size.width);
    }
    if (offsetY !== undefined) {
      this.offsetY = getPctValue(String(offsetY), this.size.height);
    }
  }
}
