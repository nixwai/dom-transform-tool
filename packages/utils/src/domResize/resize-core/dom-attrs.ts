import type { DomResizeOptions } from '../types';
import type { Dir } from '../typing';
import { DomSize, DomVariant } from '../../core';
import { getPctValue, toNum } from '../../utils';

export class DomAttrs {
  /** 水平偏移值 */
  offsetX: number = 0;
  /** 垂直偏移值 */
  offsetY: number = 0;

  /** 鼠标位置 */
  pointerDir: {
    /** 水平方向，1: 前方，-1: 后方 */
    x: Dir
    /** 垂直方向，1: 前方，-1: 后方 */
    y: Dir
  } = { x: 1, y: 1 };

  public variant = new DomVariant();
  public size = new DomSize();

  constructor(private options: DomResizeOptions) {
    this.updateTargetAttrsInfo();
    this.updateSizeConstraints();
    this.updateOffsetInfo();
    this.updatePointerDirection();
    this.customDomAttrs();
  }

  /** 更新目标属性信息 */
  private updateTargetAttrsInfo() {
    if (!this.options.target) { return; }
    const domStyles = window.getComputedStyle(this.options.target, null);
    const parentStyles = window.getComputedStyle(this.options.target.parentNode as HTMLDivElement, null);
    this.size.setSizeInfo(domStyles, parentStyles);
    this.variant.setVariantInfo(domStyles, this.options.target?.style?.transformOrigin);
  }

  private updateSizeConstraints() {
    this.size.lockWidthHeightRatio(this.options.lockAspectRatio || false);
  }

  /** 初始化指针点击的位置 */
  private updatePointerDirection() {
    if (!this.options.target) { return; }
    if (!this.options.pointer) {
      this.pointerDir.x = 1;
      this.pointerDir.y = 1;
      return;
    }

    const rect = this.options.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // 鼠标相对于元素中心的坐标
    const pointerX = this.options.pointer.clientX - centerX;
    const pointerY = this.options.pointer.clientY - centerY;
    // 旋转角度（转换为弧度）
    const angleRad = -this.variant.rotate * Math.PI / 180;
    // 应用逆时针旋转矩阵
    const rotatedX = pointerX * Math.cos(angleRad) - pointerY * Math.sin(angleRad);
    const rotatedY = pointerX * Math.sin(angleRad) + pointerY * Math.cos(angleRad);
    // 根据旋转后的坐标判断方向
    this.pointerDir.x = rotatedX > 0 ? 1 : -1;
    this.pointerDir.y = rotatedY > 0 ? 1 : -1;
  }

  /** 更新偏移信息 */
  private updateOffsetInfo() {
    if (this.options.offset === 'position') {
      this.offsetX = this.variant.positionLeft;
      this.offsetY = this.variant.positionTop;
    }
    else if (this.options.offset === 'translate') {
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

    if (parentWidth) {
      this.size.parentWidth = parentWidth;
    }
    if (parentHeight) {
      this.size.parentHeight = parentHeight;
    }
    if (width !== undefined) {
      this.size.width = getPctValue(String(width), this.size.parentWidth);
    }
    if (height !== undefined) {
      this.size.height = getPctValue(String(height), this.size.parentHeight);
    }
    if (maxWidth !== undefined) {
      this.size.maxWidth = getPctValue(String(maxWidth), this.size.parentWidth);
    }
    if (maxHeight !== undefined) {
      this.size.maxHeight = getPctValue(String(maxHeight), this.size.parentHeight);
    }
    if (minWidth !== undefined) {
      this.size.minWidth = getPctValue(String(minWidth), this.size.parentWidth);
    }
    if (minHeight !== undefined) {
      this.size.minHeight = getPctValue(String(minHeight), this.size.parentHeight);
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
