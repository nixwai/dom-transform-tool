import type { DomResizeOptions } from '../types';
import { DomSize, DomVariant } from '../../base';
import { getPctValue, toNum } from '../../utils';

export class ResizeDomAttrs {
  /** 水平偏移值 */
  offsetX: number = 0;
  /** 垂直偏移值 */
  offsetY: number = 0;

  public variant = new DomVariant();
  public size = new DomSize();

  constructor(private options: DomResizeOptions) {
    this.updateTargetAttrsInfo();
    this.updateOffsetInfo();
    this.customDomAttrs();
    this.updateSizeConstraints();
  }

  /** 更新目标属性信息 */
  private updateTargetAttrsInfo() {
    if (!this.options.target) { return; }
    const domStyles = window.getComputedStyle(this.options.target, null);
    const parentStyles = window.getComputedStyle(this.options.target.parentNode as HTMLElement, null);
    this.size.setSizeInfo(domStyles, parentStyles);
    this.variant.setVariantInfo(domStyles, this.options.target?.style?.transformOrigin);
  }

  private updateSizeConstraints() {
    this.size.lockWidthHeightRatio(this.options.lockAspectRatio || false);
  }

  /** 更新偏移信息 */
  private updateOffsetInfo() {
    if (this.options.offsetType === 'position') {
      this.offsetX = this.variant.positionLeft;
      this.offsetY = this.variant.positionTop;
    }
    else if (this.options.offsetType === 'translate') {
      this.offsetX = this.variant.translateX;
      this.offsetY = this.variant.translateY;
    }
    else {
      if (this.variant.transformValue.length > 6) {
        this.offsetX = this.variant.transformValue[12];
        this.offsetY = this.variant.transformValue[13];
      }
      else {
        this.offsetX = this.variant.transformValue[4];
        this.offsetY = this.variant.transformValue[5];
      }
    }
  }

  /** 自定义信息 */
  private customDomAttrs() {
    if (!this.options.customStyle) { return; }

    const { parentWidth, parentHeight, width, height, maxWidth, maxHeight, minWidth, minHeight } = this.options.customStyle;
    const { offsetX, offsetY, rotate, scale, transformOrigin } = this.options.customStyle;

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
    if (maxWidth !== undefined) {
      this.size.domMaxWidth = this.size.maxWidth = getPctValue(String(maxWidth), this.size.parentWidth);
    }
    if (maxHeight !== undefined) {
      this.size.domMaxHeight = this.size.maxHeight = getPctValue(String(maxHeight), this.size.parentHeight);
    }
    if (minWidth !== undefined) {
      this.size.domMinWidth = this.size.minWidth = getPctValue(String(minWidth), this.size.parentWidth);
    }
    if (minHeight !== undefined) {
      this.size.domMinHeight = this.size.minHeight = getPctValue(String(minHeight), this.size.parentHeight);
    }
    if (rotate !== undefined) {
      this.variant.rotate = toNum(String(rotate));
    }
    if (scale !== undefined) {
      const scaleList = new Array<string | number>().concat(scale).join(' ').split(/\s+/);
      this.variant.scaleX = toNum(scaleList[0]);
      this.variant.scaleY = toNum(scaleList[1] || scaleList[0]);
    }
    if (transformOrigin !== undefined) {
      this.variant.resolveTransformOrigin(transformOrigin);
    }
    if (offsetX !== undefined) {
      this.offsetX = getPctValue(String(offsetX), this.size.width);
    }
    if (offsetY !== undefined) {
      this.offsetY = getPctValue(String(offsetY), this.size.height);
    }
  }
}
