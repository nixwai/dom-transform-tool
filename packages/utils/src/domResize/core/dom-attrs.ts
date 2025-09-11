import type { DomResizeOptions } from '../types';
import type { Dir } from '../typing';

const matrixValueReg = /(matrix3?d?)\((.+)\)/;

export class DomAttrs {
  /** 元素样式 */
  domStyles?: CSSStyleDeclaration;
  /** 父级元素样式 */
  parentStyles?: CSSStyleDeclaration;
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
  /** transform信息 */
  transform = {
    /** matrix3d || matrix */
    name: 'matrix',
    /** matrix值 */
    values: [1, 0, 0, 1, 0, 0],
    /** 调整偏移值前的字符串 */
    beforeTranslateValueStr: '1,0,0,1',
    /** 调整偏移值后的字符串 */
    afterTranslateValueStr: '',
    /** 横轴缩放值 */
    scaleX: 1,
    /** 纵轴缩放值 */
    scaleY: 1,
    /** 旋转值 */
    rotate: 0,
    /** 横轴变形原点相对位置 */
    originRelativeX: 0.5,
    /** 纵轴变形原点相对位置 */
    originRelativeY: 0.5,
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

  public hasUpdate = false;
  public updateDomAttrs(options: DomResizeOptions, target?: HTMLDivElement) {
    this.hasUpdate = false;
    const taskList: [unknown, () => void][] = [
      [
        target,
        this.updateTargetAttrsInfo,
      ],
      [
        target || options.lockAspectRatio !== this.options.lockAspectRatio,
        this.updateSizeConstraints,
      ],
      [
        target || options.offset !== this.options.offset,
        this.updateOffsetInfo,
      ],
    ];
    this.options = options;
    taskList.forEach(([condition, fn]) => {
      if (condition) {
        this.hasUpdate = true;
        fn.call(this);
      }
    });

    this.updatePointerDirection();
  }

  /** 更新目标属性信息 */
  private updateTargetAttrsInfo() {
    if (this.options.target) {
      this.domStyles = window.getComputedStyle(this.options.target, null);
      this.parentStyles = window.getComputedStyle(this.options.target.parentNode as HTMLDivElement, null);
      this.setSizeInfo();
      this.setTransformInfo();
      this.setTransformOrigin();
    }
  }

  /** 尺寸信息 */
  private setSizeInfo(): void {
    if (!this.domStyles) { return; }

    // 获取宽高
    this.width = toNum(this.domStyles.width);
    this.height = toNum(this.domStyles.height);
    this.aspectRatio = this.height !== 0 ? this.width / this.height : 1;

    if (!this.parentStyles) { return; }

    // 获取父级的宽高
    this.parentWidth = toNum(this.parentStyles.width);
    this.parentHeight = toNum(this.parentStyles.height);
    if (this.domStyles.boxSizing === 'border-box') {
      this.parentWidth = this.parentWidth - toNum(this.domStyles.paddingLeft) - toNum(this.domStyles.paddingRight);
      this.parentHeight = this.parentHeight - toNum(this.domStyles.paddingTop) - toNum(this.domStyles.paddingBottom);
    }

    // 宽高限制
    this.domMaxWidth = getPctValue(this.domStyles.maxWidth, this.parentWidth) || Infinity;
    this.domMaxHeight = getPctValue(this.domStyles.maxHeight, this.parentHeight) || Infinity;
    this.domMinWidth = getPctValue(this.domStyles.minWidth, this.parentWidth) || 0;
    this.domMinHeight = getPctValue(this.domStyles.minHeight, this.parentHeight) || 0;
  }

  /** 变换信息 */
  private setTransformInfo() {
    if (!this.domStyles) { return; }

    // 获取transform相关信息
    const matchValue = this.domStyles.transform.match(matrixValueReg);
    this.transform.name = matchValue?.[1] || 'matrix'; // matrix3d || matrix
    this.transform.values = matchValue?.[2]?.split(',').map(Number) || [1, 0, 0, 1, 0, 0];
    if (this.transform.values.length > 6) {
      // matrix3d(https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/matrix3d)
      this.transform.beforeTranslateValueStr = `${this.transform.values.slice(0, 12).join(',')},`;
      this.transform.afterTranslateValueStr = `,${this.transform.values.slice(15).join(',')}`;
      // scale与rotate的配置信息
      const a = this.transform.values[0];
      const b = this.transform.values[1];
      const c = this.transform.values[4];
      const d = this.transform.values[5];
      // x轴和y轴的缩放倍数
      this.transform.scaleX = transformValuePrecision(Math.sqrt(a * a + b * b));
      this.transform.scaleY = transformValuePrecision(Math.sqrt(c * c + d * d));
      // 计算旋转角度
      this.transform.rotate = transformValuePrecision((Math.atan2(b, a) * 180 / Math.PI + 360) % 360);
    }
    else {
      // matrix(https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/matrix)
      this.transform.beforeTranslateValueStr = `${this.transform.values.slice(0, 4).join(',')},`;
      this.transform.afterTranslateValueStr = '';
      // scale与rotate的配置信息
      const a = this.transform.values[0];
      const b = this.transform.values[1];
      const c = this.transform.values[2];
      const d = this.transform.values[3];
      // x轴和y轴的缩放倍数
      this.transform.scaleX = transformValuePrecision(Math.sqrt(a * a + b * b));
      this.transform.scaleY = transformValuePrecision(Math.sqrt(c * c + d * d));
      // 计算旋转角度
      this.transform.rotate = transformValuePrecision((Math.atan2(b, a) * 180 / Math.PI + 360) % 360);
    }
  }

  /** 变化原点 */
  private setTransformOrigin() {
    if (!this.domStyles) { return; }

    // 获取transform变形原点相对定位的位置
    const domTransformOriginList = this.domStyles.transformOrigin.split(' ');
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
    this.transform.originRelativeX = originX / this.width;
    this.transform.originRelativeY = originY / this.height;
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
    const angleRad = -this.transform.rotate * Math.PI / 180;
    // 应用逆时针旋转矩阵
    const rotatedX = pointerX * Math.cos(angleRad) - pointerY * Math.sin(angleRad);
    const rotatedY = pointerX * Math.sin(angleRad) + pointerY * Math.cos(angleRad);
    // 根据旋转后的坐标判断方向
    this.pointerDir.x = rotatedX > 0 ? 1 : -1;
    this.pointerDir.y = rotatedY > 0 ? 1 : -1;
  }

  /** 更新偏移信息 */
  private updateOffsetInfo() {
    if (!this.domStyles) { return; }
    // 获取偏移
    if (this.options.offset === 'position') {
      // 使用position
      this.offsetX = toNum(this.domStyles.left);
      this.offsetY = toNum(this.domStyles.top);
    }
    else if (this.options.offset === 'translate') {
      // 使用translate
      if (!this.domStyles.translate || this.domStyles.translate === 'none') {
        this.offsetX = 0;
        this.offsetY = 0;
      }
      else {
        const translate = this.domStyles.translate.split(' ');
        this.offsetX = toNum(translate[0]);
        this.offsetY = toNum(translate[1]);
      }
    }
    else {
      // 使用transform
      if (this.transform.values.length > 6) {
        this.offsetX = this.transform.values[12];
        this.offsetY = this.transform.values[13];
      }
      else {
        this.offsetX = this.transform.values[4];
        this.offsetY = this.transform.values[5];
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
