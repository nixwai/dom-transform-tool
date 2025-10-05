import type { DomDragCustomRender, DomDragOptions, DomDragStyle } from '../types';
import type { DragDomAttrs } from './drag-dom-attrs';
import { createDomStyleUpdateMethod } from '../../utils';

/** 设置位移样式 */
export type SetStyleOffset = (valueX: number, valueY: number) => DomDragStyle;

export class DragStyleUpdater {
  private targetRef?: WeakRef<HTMLElement>;

  /** 设置位移样式 */
  public setStyleOffset: SetStyleOffset = () => ({});

  constructor(private options: DomDragOptions, private dragDomAttrs: DragDomAttrs) {
    if (options.target) {
      this.targetRef = new WeakRef(options.target);
    }
    this.setStyleOffsetUpdater();
  }

  /** 设置位移样式更新方法 */
  private setStyleOffsetUpdater() {
    if (this.options.offsetType) {
      this.setStyleOffset = createDomStyleUpdateMethod<SetStyleOffset, DomDragStyle>(
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
  private changeByCustomRender(key: keyof DomDragCustomRender) {
    return (value: number) => {
      const customRender = this.options.customRender?.[key];
      const customValue = customRender?.(
        value,
        {
          parentWidth: this.dragDomAttrs.size.parentWidth,
          parentHeight: this.dragDomAttrs.size.parentHeight,
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
      const { transformName, transformValue } = this.dragDomAttrs.variant;
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
