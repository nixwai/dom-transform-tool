import type { DomResizeOptions } from '../types';

export type Dir = 1 | -1;

export interface DomAttrs {
  /** 元素样式 */
  styles?: CSSStyleDeclaration
  /** 父级元素样式 */
  parentStyles?: CSSStyleDeclaration
  /** 父级宽度 */
  parentWidth: number
  /** 父级高度 */
  parentHeight: number
  /** 宽 */
  width: number
  /** 高 */
  height: number
  /** 宽高比 */
  aspectRatio: number
  /** 最大宽度 */
  maxWidth: number
  /** 最大高度 */
  maxHeight: number
  /** 最小宽度 */
  minWidth: number
  /** 最小高度 */
  minHeight: number
  /** 水平偏移值 */
  offsetX: number
  /** 垂直偏移值 */
  offsetY: number
  /** transform信息 */
  transform: {
    /** matrix3d || matrix */
    name: string
    /** matrix值 */
    values: number[]
    /** 调整偏移值前的字符串 */
    beforeTranslateValueStr: string
    /** 调整偏移值后的字符串 */
    afterTranslateValueStr: string
    /** 横轴缩放值 */
    scaleX: number
    /** 纵轴缩放值 */
    scaleY: number
    /** 旋转值 */
    rotate: number
    /** 横轴变形原点相对位置 */
    originRelativeX: number
    /** 纵轴变形原点相对位置 */
    originRelativeY: number
  }
  /** 鼠标位置 */
  pointerDir: {
    /** 水平方向，1: 前方，-1: 后方 */
    x: Dir
    /** 垂直方向，1: 前方，-1: 后方 */
    y: Dir
  }
  /** 手动调整距离 */
  manual: {
    /** 横轴移动距离 */
    distanceX: number
    /** 纵轴移动距离 */
    distanceY: number
  }
}

const matrixValueReg = /(matrix3?d?)\((.+)\)/;
function toNum(value?: string) {
  if (!value) { return 0; }
  return Number.parseFloat(value) || 0;
}

/** 获取调整元素的属性信息 */
export function getResizeDomAttrs(options: DomResizeOptions, dom?: HTMLDivElement): Readonly<DomAttrs> {
  const domAttrs: DomAttrs = {
    parentWidth: 0,
    parentHeight: 0,
    width: 0,
    height: 0,
    aspectRatio: 0,
    maxWidth: Infinity,
    maxHeight: Infinity,
    minWidth: 0,
    minHeight: 0,
    offsetX: 0,
    offsetY: 0,
    transform: {
      name: 'matrix',
      values: [1, 0, 0, 1, 0, 0],
      beforeTranslateValueStr: '1,0,0,1',
      afterTranslateValueStr: '',
      scaleX: 1,
      scaleY: 1,
      rotate: 0,
      originRelativeX: 0.5,
      originRelativeY: 0.5,
    },
    pointerDir: {
      x: 1,
      y: 1,
    },
    manual: {
      distanceX: 0,
      distanceY: 0,
    },
  };
  if (!dom) { return domAttrs; }
  const domStyles = window.getComputedStyle(dom, null);
  const parentStyles = window.getComputedStyle(dom.parentNode as HTMLDivElement, null);
  domAttrs.styles = domStyles;
  domAttrs.parentStyles = parentStyles;

  // 获取transform相关matrix信息
  const matchValue = domStyles.transform.match(matrixValueReg);
  domAttrs.transform.name = matchValue?.[1] || 'matrix'; // matrix3d || matrix
  domAttrs.transform.values = matchValue?.[2]?.split(',').map(Number) || [1, 0, 0, 1, 0, 0];
  if (domAttrs.transform.values.length > 6) {
    // matrix3d(https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/matrix3d)
    domAttrs.transform.beforeTranslateValueStr = `${domAttrs.transform.values.slice(0, 12).join(',')},`;
    domAttrs.transform.afterTranslateValueStr = `,${domAttrs.transform.values.slice(15).join(',')}`;
    domAttrs.offsetX = domAttrs.transform.values[12];
    domAttrs.offsetY = domAttrs.transform.values[13];
    // scale与rotate的配置信息
    const a = domAttrs.transform.values[0];
    const b = domAttrs.transform.values[1];
    const c = domAttrs.transform.values[4];
    const d = domAttrs.transform.values[5];
    // x轴和y轴的缩放倍数
    domAttrs.transform.scaleX = transformValuePrecision(Math.sqrt(a * a + b * b));
    domAttrs.transform.scaleY = transformValuePrecision(Math.sqrt(c * c + d * d));
    // 计算旋转角度
    domAttrs.transform.rotate = transformValuePrecision((Math.atan2(b, a) * 180 / Math.PI + 360) % 360);
  }
  else {
    // matrix(https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/matrix)
    domAttrs.transform.beforeTranslateValueStr = `${domAttrs.transform.values.slice(0, 4).join(',')},`;
    domAttrs.transform.afterTranslateValueStr = '';
    domAttrs.offsetX = domAttrs.transform.values[4];
    domAttrs.offsetY = domAttrs.transform.values[5];
    // scale与rotate的配置信息
    const a = domAttrs.transform.values[0];
    const b = domAttrs.transform.values[1];
    const c = domAttrs.transform.values[2];
    const d = domAttrs.transform.values[3];
    // x轴和y轴的缩放倍数
    domAttrs.transform.scaleX = transformValuePrecision(Math.sqrt(a * a + b * b));
    domAttrs.transform.scaleY = transformValuePrecision(Math.sqrt(c * c + d * d));
    // 计算旋转角度
    domAttrs.transform.rotate = transformValuePrecision((Math.atan2(b, a) * 180 / Math.PI + 360) % 360);
  }

  // 获取偏移
  if (options.offset === 'position') {
    // 使用position
    domAttrs.offsetX = toNum(domStyles.left);
    domAttrs.offsetY = toNum(domStyles.top);
  }
  else if (options.offset === 'translate') {
    // 使用translate
    if (!domStyles.translate || domStyles.translate === 'none') {
      domAttrs.offsetX = 0;
      domAttrs.offsetY = 0;
    }
    else {
      const translate = domStyles.translate.split(' ');
      domAttrs.offsetX = toNum(translate[0]);
      domAttrs.offsetY = toNum(translate[1]);
    }
  }
  else {
    // 使用transform
    if (domAttrs.transform.values.length > 6) {
      domAttrs.offsetX = domAttrs.transform.values[12];
      domAttrs.offsetY = domAttrs.transform.values[13];
    }
    else {
      domAttrs.offsetX = domAttrs.transform.values[4];
      domAttrs.offsetY = domAttrs.transform.values[5];
    }
  }

  // 获取宽高
  domAttrs.width = toNum(domStyles.width);
  domAttrs.height = toNum(domStyles.height);
  domAttrs.aspectRatio = domAttrs.height !== 0 ? domAttrs.width / domAttrs.height : 1;

  // 获取父级的宽高
  domAttrs.parentWidth = toNum(parentStyles.width);
  domAttrs.parentHeight = toNum(parentStyles.height);
  if (parentStyles.boxSizing === 'border-box') {
    domAttrs.parentWidth = domAttrs.parentWidth - toNum(parentStyles.paddingLeft) - toNum(parentStyles.paddingRight);
    domAttrs.parentHeight = domAttrs.parentHeight - toNum(parentStyles.paddingTop) - toNum(parentStyles.paddingBottom);
  }

  // 设置宽高限制
  domAttrs.maxWidth = domStyles.maxWidth.includes('%') ? domAttrs.parentWidth * toNum(domStyles.maxWidth) / 100 : toNum(domStyles.maxWidth) || Infinity;
  domAttrs.maxHeight = domStyles.maxHeight.includes('%') ? domAttrs.parentHeight * toNum(domStyles.maxHeight) / 100 : toNum(domStyles.maxHeight) || Infinity;
  domAttrs.minWidth = domStyles.minWidth.includes('%') ? domAttrs.parentWidth * toNum(domStyles.minWidth) / 100 : toNum(domStyles.minWidth);
  domAttrs.minHeight = domStyles.minHeight.includes('%') ? domAttrs.parentHeight * toNum(domStyles.minHeight) / 100 : toNum(domStyles.minHeight);
  if (options.lockAspectRatio) {
    // 锁定纵横比时，最小宽高也会受限改变
    const lockMinHeight = domAttrs.minHeight * domAttrs.aspectRatio;
    if (lockMinHeight > domAttrs.minWidth) {
      domAttrs.minWidth = lockMinHeight;
    }
    else {
      domAttrs.minHeight = domAttrs.minWidth / domAttrs.aspectRatio;
    }
  }

  // 获取transform变形原点相对定位的位置
  const domTransformOriginList = domStyles.transformOrigin.split(' ');
  const styleTransformOriginStr = dom.style.transformOrigin;
  const styleTransformOriginList = styleTransformOriginStr.split(' ');
  const originIsAbsolute = Array.isArray(options.originIsAbsolute) ? options.originIsAbsolute : [options.originIsAbsolute, options.originIsAbsolute];
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
  domAttrs.transform.originRelativeX = originX / domAttrs.width;
  domAttrs.transform.originRelativeY = originY / domAttrs.height;

  // 获取点击在元素的哪个方向
  if (options.pointer) {
    const rect = dom.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // 鼠标相对于元素中心的坐标
    const pointerX = options.pointer.clientX - centerX;
    const pointerY = options.pointer.clientY - centerY;
    // 旋转角度（转换为弧度）
    const angleRad = -domAttrs.transform.rotate * Math.PI / 180;
    // 应用逆时针旋转矩阵
    const rotatedX = pointerX * Math.cos(angleRad) - pointerY * Math.sin(angleRad);
    const rotatedY = pointerX * Math.sin(angleRad) + pointerY * Math.cos(angleRad);
    // 根据旋转后的坐标判断方向
    domAttrs.pointerDir.x = rotatedX > 0 ? 1 : -1;
    domAttrs.pointerDir.y = rotatedY > 0 ? 1 : -1;
  }

  // 获取手动调整的偏移量
  if (options.manual?.width || options.manual?.height) {
    const manualWidth = options.manual.width?.toString() || '0';
    const manualHeight = options.manual.height?.toString() || '0';
    domAttrs.manual.distanceX = manualWidth.includes('%') ? toNum(manualWidth) / 100 * domAttrs.parentWidth : toNum(manualWidth);
    domAttrs.manual.distanceY = manualHeight.includes('%') ? toNum(manualHeight) / 100 * domAttrs.parentHeight : toNum(manualHeight);
    if (options.manual.type === 'size') {
      domAttrs.manual.distanceX = domAttrs.manual.distanceX - domAttrs.width;
      domAttrs.manual.distanceY = domAttrs.manual.distanceY - domAttrs.height;
    }
  }
  return domAttrs;
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
