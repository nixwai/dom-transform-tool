import type { DomResizeOptions } from '../types';
import type { Dir } from '../typing';

const matrixValueReg = /(matrix3?d?)\((.+)\)/;

export class DomAttrs {
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
  /** 水平偏移值 */
  offsetX: number = 0;
  /** 垂直偏移值 */
  offsetY: number = 0;
  /** 变形信息（位移、旋转、缩放） */
  variant = {
    /** matrix3d || matrix */
    transformName: 'matrix',
    /** transform值 */
    transformValue: [1, 0, 0, 1, 0, 0],
    /** 横轴变形原点相对位置 */
    transformOriginX: 0.5,
    /** 纵轴变形原点相对位置 */
    transformOriginY: 0.5,
    /** 定位坐标left */
    positionLeft: 0,
    /** 定位坐标top */
    positionTop: 0,
    /** X轴位移 */
    translateX: 0,
    /** Y轴位移 */
    translateY: 0,
    /** 横轴缩放值 */
    scaleX: 1,
    /** 纵轴缩放值 */
    scaleY: 1,
    /** 旋转值 */
    rotate: 0,
  };

  /** 鼠标位置 */
  pointerDir: {
    /** 水平方向，1: 前方，-1: 后方 */
    x: Dir
    /** 垂直方向，1: 前方，-1: 后方 */
    y: Dir
  } = { x: 1, y: 1 };

  private domMinWidth = 0;
  private domMinHeight = 0;
  private domMaxWidth = Infinity;
  private domMaxHeight = Infinity;

  constructor(private options: DomResizeOptions) {
    this.updateTargetAttrsInfo();
    this.updateSizeConstraints();
    this.updateOffsetInfo();
    this.updatePointerDirection();
  }

  /** 当前元素尺寸是否发生改变 */
  public isSizeUpdate = false;
  /** 当前元素偏移是否发生改变 */
  public isOffsetUpdate = false;

  public updateDomAttrs(options: DomResizeOptions, target?: HTMLDivElement) {
    this.isSizeUpdate = false;
    this.isOffsetUpdate = false;
    const taskList: [unknown, () => void][] = [
      [
        target,
        () => {
          this.updateTargetAttrsInfo();
          this.isSizeUpdate = true;
        },
      ],
      [
        target || options.lockAspectRatio !== this.options.lockAspectRatio,
        () => {
          this.updateSizeConstraints();
          this.isSizeUpdate = true;
        },
      ],
      [
        target || options.offset !== this.options.offset,
        () => {
          this.updateOffsetInfo();
          this.isOffsetUpdate = true;
        },
      ],
    ];
    this.options = options;
    taskList.forEach(([condition, fn]) => {
      if (condition) { fn.call(this); }
    });
    this.updatePointerDirection();
  }

  /** 更新目标属性信息 */
  private updateTargetAttrsInfo() {
    if (!this.options.target) { return; }
    const domStyles = window.getComputedStyle(this.options.target, null);
    const parentStyles = window.getComputedStyle(this.options.target.parentNode as HTMLDivElement, null);
    this.setSizeInfo(domStyles, parentStyles);
    this.setVariantInfo(domStyles);
    this.setTransformOrigin(domStyles);
  }

  /** 尺寸信息 */
  private setSizeInfo(domStyles: CSSStyleDeclaration, parentStyles: CSSStyleDeclaration): void {
    // 获取宽高
    this.width = toNum(domStyles.width);
    this.height = toNum(domStyles.height);
    this.aspectRatio = this.height !== 0 && this.width !== 0 ? this.width / this.height : 1;

    // 获取父级的宽高
    this.parentWidth = toNum(parentStyles.width);
    this.parentHeight = toNum(parentStyles.height);
    if (parentStyles.boxSizing === 'border-box') {
      this.parentWidth = this.parentWidth - toNum(parentStyles.paddingLeft) - toNum(parentStyles.paddingRight);
      this.parentHeight = this.parentHeight - toNum(parentStyles.paddingTop) - toNum(parentStyles.paddingBottom);
    }

    // 宽高限制
    this.domMaxWidth = getPctValue(domStyles.maxWidth, this.parentWidth) || Infinity;
    this.domMaxHeight = getPctValue(domStyles.maxHeight, this.parentHeight) || Infinity;
    this.domMinWidth = getPctValue(domStyles.minWidth, this.parentWidth) || 0;
    this.domMinHeight = getPctValue(domStyles.minHeight, this.parentHeight) || 0;
  }

  /** 变换信息 */
  private setVariantInfo(domStyles: CSSStyleDeclaration) {
    // 获取transform相关信息
    const matchValue = domStyles.transform.match(matrixValueReg);
    this.variant.transformName = matchValue?.[1] || 'matrix'; // matrix3d || matrix
    this.variant.transformValue = matchValue?.[2]?.split(',').map(Number) || [1, 0, 0, 1, 0, 0];
    if (this.variant.transformValue.length > 6) {
      // scale与rotate的配置信息
      const a = this.variant.transformValue[0];
      const b = this.variant.transformValue[1];
      const c = this.variant.transformValue[4];
      const d = this.variant.transformValue[5];
      // x轴和y轴的缩放倍数
      this.variant.scaleX = transformValuePrecision(Math.sqrt(a * a + b * b));
      this.variant.scaleY = transformValuePrecision(Math.sqrt(c * c + d * d));
      // 计算旋转角度
      this.variant.rotate = transformValuePrecision((Math.atan2(b, a) * 180 / Math.PI + 360) % 360);
    }
    else {
      // scale与rotate的配置信息
      const a = this.variant.transformValue[0];
      const b = this.variant.transformValue[1];
      const c = this.variant.transformValue[2];
      const d = this.variant.transformValue[3];
      // x轴和y轴的缩放倍数
      this.variant.scaleX = transformValuePrecision(Math.sqrt(a * a + b * b));
      this.variant.scaleY = transformValuePrecision(Math.sqrt(c * c + d * d));
      // 计算旋转角度
      this.variant.rotate = transformValuePrecision((Math.atan2(b, a) * 180 / Math.PI + 360) % 360);
    }

    if (domStyles.scale && domStyles.scale !== 'none') {
      const scaleList = domStyles.scale.split(/\s+/);
      this.variant.scaleX *= toNum(scaleList[0]);
      this.variant.scaleY *= toNum(scaleList[1] || scaleList[0]);
    }

    if (domStyles.rotate && domStyles.rotate !== 'none') {
      this.variant.rotate += toNum(domStyles.rotate);
    }

    // 获取定位值
    this.variant.positionLeft = toNum(domStyles.left);
    this.variant.positionTop = toNum(domStyles.top);
    // 获取偏移值
    if (!domStyles.translate || domStyles.translate === 'none') {
      this.variant.translateX = 0;
      this.variant.translateY = 0;
    }
    else {
      const translate = domStyles.translate.split(/\s+/);
      this.variant.translateX = toNum(translate[0]);
      this.variant.translateY = toNum(translate[1]);
    }
  }

  /** 变化原点 */
  private setTransformOrigin(domStyles: CSSStyleDeclaration) {
    // 获取transform变形原点相对定位的位置
    const domTransformOriginList = domStyles.transformOrigin.split(' ');
    const styleTransformOriginStr = this.options.target?.style?.transformOrigin || '';
    const styleTransformOriginList = styleTransformOriginStr.split(' ');
    //
    // const originIsAbsolute = Array.isArray(this.options.originIsAbsolute)
    //   ? this.options.originIsAbsolute
    //   : [this.options.originIsAbsolute, this.options.originIsAbsolute];
    const originIsAbsolute: boolean[] = [];

    const originX = parseTransformOriginValue(
      originIsAbsolute[0],
      domTransformOriginList[0],
      styleTransformOriginList[0],
      styleTransformOriginStr.includes('left') || styleTransformOriginStr.includes('right'),
    );
    const originY = parseTransformOriginValue(
      originIsAbsolute[1],
      domTransformOriginList[1],
      styleTransformOriginList[1],
      styleTransformOriginStr.includes('top') || styleTransformOriginStr.includes('bottom'),
    );
    this.variant.transformOriginX = originX / this.width;
    this.variant.transformOriginY = originY / this.height;
  }

  private updateSizeConstraints() {
    if (this.options.lockAspectRatio) {
      // 锁定纵横比时，最小宽高也会受限改变
      const lockMinHeight = this.domMinHeight * this.aspectRatio;
      if (lockMinHeight > this.domMinHeight) {
        this.minWidth = lockMinHeight;
      }
      else {
        this.minHeight = this.domMinWidth / this.aspectRatio;
      }
    }
    else {
      this.minWidth = this.domMinWidth;
      this.minHeight = this.domMinHeight;
    }

    this.maxWidth = this.domMaxWidth;
    this.maxHeight = this.domMaxHeight;
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
}

/** 获取百分比值 */
function getPctValue(value: string, parentValue: number) {
  return value.includes('%') ? parentValue * toNum(value) / 100 : toNum(value);
}

/** 转换为数字 */
function toNum(value?: string) {
  if (!value) { return 0; }
  return Number.parseFloat(value) || 0;
}

/** 解析 transform-origin相对定位的位置，绝对位置固定为0 */
function parseTransformOriginValue(isAbsolute: boolean | undefined, domValue: string, styleValue: string | undefined, hasKeyword: boolean): number {
  if (isAbsolute === true) {
    return 0;
  }
  if (isAbsolute === false) {
    return toNum(domValue);
  }
  if (!styleValue || styleValue.includes('%') || styleValue.includes('center') || hasKeyword) {
    return toNum(domValue);
  }
  return 0;
}

/** 精度处理函数 */
function transformValuePrecision(value: number): number {
  return Math.round(value * 100) / 100;
}
