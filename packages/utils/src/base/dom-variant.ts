import { toNum } from '../utils';

const MatrixValueReg = /(matrix3?d?)\((.+)\)/;

/** 元素的变形信息 */
export class DomVariant {
  /** matrix3d || matrix */
  transformName = 'matrix';
  /** transform值 */
  transformValue = [1, 0, 0, 1, 0, 0];
  /** 变形原点 */
  originPosition = { x: 0, y: 0 };
  /** 横轴变形原点相对位置 */
  transformOriginX = 0.5;
  /** 纵轴变形原点相对位置 */
  transformOriginY = 0.5;
  /** 定位坐标left */
  positionLeft = 0;
  /** 定位坐标top */
  positionTop = 0;
  /** X轴位移 */
  translateX = 0;
  /** Y轴位移 */
  translateY = 0;
  /** transform的横轴缩放值 */
  transformScaleX = 1;
  /** transform的纵轴缩放值 */
  transformScaleY = 1;
  /** 来自独立的scale样式横轴缩放值 */
  styleScaleX = 1;
  /** 来自独立的scale样式纵轴缩放值 */
  styleScaleY = 1;
  /** 横轴总缩放值（transformScaleX * styleScaleX） */
  scaleX = 1;
  /** 纵轴总缩放值（transformScaleY * styleScaleY） */
  scaleY = 1;
  /** transform的旋转值 */
  transformRotate = 0;
  /** 来自独立的rotate样式旋转值 */
  styleRotate = 0;
  /** 总旋转值（transformRotate + styleRotate） */
  rotate = 0;

  /** 获取所有变形信息 */
  public setVariantInfo(domStyles: CSSStyleDeclaration, transformOrigin?: string | string[]) {
    this.setTransform(domStyles);
    this.setPosition(domStyles);
    this.setTranslate(domStyles);
    this.setScale(domStyles);
    this.setRotate(domStyles);
    this.setTransformOrigin(domStyles, transformOrigin);
  }

  /** 获取transform相关信息 */
  public setTransform(domStyles: CSSStyleDeclaration) {
    const matchValue = domStyles.transform.match(MatrixValueReg);
    this.transformName = matchValue?.[1] || 'matrix'; // matrix3d || matrix
    this.transformValue = matchValue?.[2]?.split(',').map(Number) || [1, 0, 0, 1, 0, 0];
  }

  /** 获取定位值 */
  public setPosition(domStyles: CSSStyleDeclaration) {
    this.positionLeft = toNum(domStyles.left);
    this.positionTop = toNum(domStyles.top);
  }

  /** 获取位移值 */
  public setTranslate(domStyles: CSSStyleDeclaration) {
    const translate = domStyles.translate.split(/\s+/);
    this.translateX = toNum(translate[0]);
    this.translateY = toNum(translate[1]);
  }

  /** 获取缩放值 */
  public setScale(domStyles: CSSStyleDeclaration) {
    if (this.transformValue.length > 6) {
      const a = this.transformValue[0];
      const b = this.transformValue[1];
      const c = this.transformValue[4];
      const d = this.transformValue[5];
      this.transformScaleX = transformValuePrecision(Math.sqrt(a * a + b * b));
      this.transformScaleY = transformValuePrecision(Math.sqrt(c * c + d * d));
    }
    else {
      const a = this.transformValue[0];
      const b = this.transformValue[1];
      const c = this.transformValue[2];
      const d = this.transformValue[3];
      this.transformScaleX = transformValuePrecision(Math.sqrt(a * a + b * b));
      this.transformScaleY = transformValuePrecision(Math.sqrt(c * c + d * d));
    }

    if (domStyles.scale && domStyles.scale !== 'none') {
      const scaleList = domStyles.scale.split(/\s+/);
      this.styleScaleX = toNum(scaleList[0]);
      this.styleScaleY = toNum(scaleList[1] ?? scaleList[0]);
    }
    else {
      this.styleScaleX = 1;
      this.styleScaleY = 1;
    }

    this.scaleX = this.transformScaleX * this.styleScaleX;
    this.scaleY = this.transformScaleY * this.styleScaleY;
  }

  /** 获取旋转值 */
  public setRotate(domStyles: CSSStyleDeclaration) {
    const a = this.transformValue[0];
    const b = this.transformValue[1];
    this.transformRotate = transformValuePrecision((Math.atan2(b, a) * 180 / Math.PI + 360) % 360);

    if (domStyles.rotate && domStyles.rotate !== 'none') {
      this.styleRotate = toNum(domStyles.rotate);
    }
    else {
      this.styleRotate = 0;
    }

    this.rotate = this.transformRotate + this.styleRotate;
  }

  /**
   * 变化原点
   * @param domStyles DOM样式
   * @param transformOrigin 变换原点样式，有传入时可以更加精准获取变化原点
   */
  public setTransformOrigin(domStyles: CSSStyleDeclaration, transformOrigin?: string | string[]) {
    const domTransformOriginList = domStyles.transformOrigin.split(/\s+/);
    this.originPosition.x = toNum(domTransformOriginList[0]);
    this.originPosition.y = toNum(domTransformOriginList[1]);
    if (transformOrigin) {
      this.resolveTransformOrigin(transformOrigin);
    }
    else {
      this.transformOriginX = this.originPosition.x / toNum(domStyles.width);
      this.transformOriginY = this.originPosition.y / toNum(domStyles.height);
    }
  }

  /** 解析设置变形原点 */
  public resolveTransformOrigin(transformOrigin: string | string[]) {
    const transformOriginStr = new Array<string>().concat(transformOrigin).join(' ');
    const transformOriginList = transformOriginStr.split(/\s+/);
    if (transformOriginStr.includes('left')) {
      this.transformOriginX = 0;
    }
    else if (transformOriginStr.includes('right')) {
      this.transformOriginX = 1;
    }
    else {
      if (!transformOriginList[0] || transformOriginList[0].includes('center')) {
        this.transformOriginX = 0.5;
      }
      else if (transformOriginList[0].includes('%')) {
        this.transformOriginX = toNum(transformOriginList[0]) / 100;
      }
      else {
        this.transformOriginX = 0;
      }
    }

    if (transformOriginStr.includes('top')) {
      this.transformOriginY = 0;
    }
    else if (transformOriginStr.includes('bottom')) {
      this.transformOriginY = 1;
    }
    else {
      if (!transformOriginList[1] || transformOriginList[1].includes('center')) {
        this.transformOriginY = 0.5;
      }
      else if (transformOriginList[1].includes('%')) {
        this.transformOriginY = toNum(transformOriginList[1]) / 100;
      }
      else {
        this.transformOriginX = 0;
      }
    }
  }
}

/** transform精度处理函数 */
function transformValuePrecision(value: number): number {
  return Math.round(value * 100) / 100;
}
