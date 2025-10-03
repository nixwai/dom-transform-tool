import type { DomResizeCustomRender, DomResizeOptions, DomResizeStyle } from '../types';
import type { ResizeDomAttrs } from './resize-dom-attrs';
import { createDomStyleUpdateMethod } from '../../utils';

/** 设置宽或者高样式 */
export type SetStyleWidthOrHeightFn = (value: number, property: 'width' | 'height') => DomResizeStyle;
/** 设置位移样式 */
export type SetStyleOffset = (valueX: number, valueY: number) => DomResizeStyle;

export class ResizeStyleUpdater {
  private targetRef?: WeakRef<HTMLElement>;

  /** 设置宽或者高样式 */
  public setStyleWidthOrHeight: SetStyleWidthOrHeightFn = () => ({});
  /** 设置位移样式 */
  public setStyleOffset: SetStyleOffset = () => ({});

  constructor(private options: DomResizeOptions, private resizeDomAttrs: ResizeDomAttrs) {
    if (options.target) {
      this.targetRef = new WeakRef(options.target);
    }
    this.setStyleWidthHeightUpdater();
    this.setStyleOffsetUpdater();
  }

  /** 设置宽高样式更新方法 */
  private setStyleWidthHeightUpdater() {
    const getWidthOrHeight = {
      width: this.changeByCustomRender('width'),
      height: this.changeByCustomRender('height'),
    };

    this.setStyleWidthOrHeight = createDomStyleUpdateMethod<SetStyleWidthOrHeightFn, DomResizeStyle>(
      (value, property) => ({ [property]: getWidthOrHeight[property](value) }),
      this.targetRef,
      this.options.disableUpdate,
    );
  }

  /** 设置位移样式更新方法 */
  private setStyleOffsetUpdater() {
    if (this.options.offsetType) {
      this.setStyleOffset = createDomStyleUpdateMethod<SetStyleOffset, DomResizeStyle>(
        this.createGetOffsetStyle(),
        this.targetRef,
        this.options.disableUpdate,
      );
    }
    else {
      this.setStyleOffset = () => ({});
    }
  }

  /** 创建改变target元素的值方法 */
  private changeByCustomRender(key: keyof DomResizeCustomRender) {
    return (value: number) => {
      const customRender = this.options.customRender?.[key];
      const customValue = customRender?.(
        value,
        {
          parentWidth: this.resizeDomAttrs.size.parentWidth,
          parentHeight: this.resizeDomAttrs.size.parentHeight,
        },
      );
      return customValue ?? `${value}px`;
    };
  }

  /** 获取位移修改函数 */
  private createGetOffsetStyle(): SetStyleOffset {
    const getOffsetX = this.changeByCustomRender('offsetX');
    const getOffsetY = this.changeByCustomRender('offsetY');
    // 使用position
    if (this.options.offsetType === 'position') {
      return (valueX, valueY) => ({ left: getOffsetX(valueX), top: getOffsetY(valueY) });
    }
    // 使用translate
    if (this.options.offsetType === 'translate') {
      return (valueX, valueY) => ({ translate: `${getOffsetX(valueX)} ${getOffsetY(valueY)}` });
    }
    // 使用transform
    if (this.options.offsetType === 'transform') {
      const { transformName, transformValue } = this.resizeDomAttrs.variant;
      let beforeTransformValueStr = '';
      let afterTransformValueStr = '';
      if (transformValue.length > 6) {
        // matrix3d(https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/matrix3d)
        beforeTransformValueStr = transformValue.slice(0, 12).join(',');
        afterTransformValueStr = transformValue.slice(14).join(',');
      }
      else {
        // matrix(https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/matrix)
        beforeTransformValueStr = transformValue.slice(0, 4).join(',');
        afterTransformValueStr = '';
      }
      // transform 不兼容customStyle自定义，无法通过getOffsetX设置，固定px类型
      return (valueX, valueY) => {
        return { transform: `${transformName}(${beforeTransformValueStr},${valueX},${valueY},${afterTransformValueStr})` };
      };
    }
    return () => ({});
  }
}
