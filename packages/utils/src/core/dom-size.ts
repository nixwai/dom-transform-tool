import { getPctValue, toNum } from '../utils';

/** 元素尺寸信息 */
export class DomSize {
  /** 父级宽度 */
  parentWidth: number = 0;
  /** 父级高度 */
  parentHeight: number = 0;
  /** 宽 */
  width: number = 0;
  /** 高 */
  height: number = 0;
  /** 宽高比 */
  aspectRatio: number = 1;
  /** 最大宽度 */
  maxWidth: number = Infinity;
  /** 最大高度 */
  maxHeight: number = Infinity;
  /** 最小宽度 */
  minWidth: number = 0;
  /** 最小高度 */
  minHeight: number = 0;

  private domMinWidth = 0;
  private domMinHeight = 0;
  private domMaxWidth = Infinity;
  private domMaxHeight = Infinity;

  /** 尺寸信息 */
  public setSizeInfo(domStyles: CSSStyleDeclaration, parentStyles: CSSStyleDeclaration): void {
    // 获取宽高
    this.width = toNum(domStyles.width);
    this.height = toNum(domStyles.height);
    this.aspectRatio = (this.height && this.width) ? (this.width / this.height) : 1;

    // 获取父级的宽高
    this.parentWidth = toNum(parentStyles.width);
    this.parentHeight = toNum(parentStyles.height);

    if (parentStyles.boxSizing === 'border-box') {
      // 宽高包含内边距时需减去
      this.parentWidth = this.parentWidth - toNum(parentStyles.paddingLeft) - toNum(parentStyles.paddingRight) - toNum(parentStyles.borderLeftWidth) - toNum(parentStyles.borderRightWidth);
      this.parentHeight = this.parentHeight - toNum(parentStyles.paddingTop) - toNum(parentStyles.paddingBottom) - toNum(parentStyles.borderTopWidth) - toNum(parentStyles.borderBottomWidth);
    }

    // 宽高限制
    this.maxWidth = this.domMaxWidth = getPctValue(domStyles.maxWidth, this.parentWidth) || Infinity;
    this.maxHeight = this.domMaxHeight = getPctValue(domStyles.maxHeight, this.parentHeight) || Infinity;
    this.minWidth = this.domMinWidth = getPctValue(domStyles.minWidth, this.parentWidth) || 0;
    this.minHeight = this.domMinHeight = getPctValue(domStyles.minHeight, this.parentHeight) || 0;
  }

  /** 固定宽高比 */
  public lockWidthHeightRatio(isLock: boolean) {
    if (isLock) {
      // 锁定纵横比时，最大与最小宽高会受限改变
      const lockMinHeight = this.domMinHeight * this.aspectRatio;
      if (lockMinHeight > this.domMinWidth) {
        this.minWidth = lockMinHeight;
        this.minHeight = this.domMinHeight;
      }
      else {
        this.minHeight = this.domMinWidth / this.aspectRatio;
        this.minWidth = this.domMinWidth;
      }
      const lockMaxHeight = this.domMaxHeight * this.aspectRatio;
      if (lockMaxHeight < this.domMaxWidth) {
        this.maxWidth = lockMaxHeight;
        this.maxHeight = this.domMaxHeight;
      }
      else {
        this.maxHeight = this.domMaxWidth / this.aspectRatio;
        this.maxWidth = this.domMaxWidth;
      }
    }
    else {
      this.minWidth = this.domMinWidth;
      this.minHeight = this.domMinHeight;
      this.maxWidth = this.domMaxWidth;
      this.maxHeight = this.domMaxHeight;
    }
  }
}
