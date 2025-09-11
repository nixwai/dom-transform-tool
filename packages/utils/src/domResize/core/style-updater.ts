import type { DomResizeCustomRender, DomResizeOffsetType, DomResizeOptions, DomResizeStyle } from '../types';
import type { DomAttrs } from './dom-attrs';

/** 设置宽或者高样式 */
export type SetStyleWidthOrHeightFn = (value: number, property: 'width' | 'height') => DomResizeStyle;
/** 设置位移样式 */
export type SetStyleOffset = (offsetX: number, offsetY: number) => DomResizeStyle;

export class StyleUpdater {
  private targetRef?: WeakRef<HTMLDivElement>;

  /** 设置宽或者高样式 */
  public setStyleWidthOrHeight: SetStyleWidthOrHeightFn = () => ({});
  /** 设置位移样式 */
  public setStyleOffset: SetStyleOffset = () => ({});

  constructor(private options: DomResizeOptions, private domAttrs: DomAttrs) {
    if (options.target) {
      this.targetRef = new WeakRef(options.target);
    }
    this.setStyleWidthHeightUpdater();
    this.setStyleOffsetUpdater();
  }

  public updateStyleUpdater(options: DomResizeOptions) {
    const hasUpdate = Boolean(
      options.target
      || options.offset !== this.options.offset
      || options.customRender !== this.options.customRender
      || options.disableUpdate !== this.options.disableUpdate,
    );
    this.options = options;
    if (hasUpdate) {
      this.setStyleWidthHeightUpdater();
      this.setStyleOffsetUpdater();
    }
  }

  /** 初始化宽高样式更新方法 */
  private setStyleWidthHeightUpdater() {
    const getWidthOrHeight = {
      width: this.createChangeTargetValue('width'),
      height: this.createChangeTargetValue('height'),
    };

    this.setStyleWidthOrHeight = this.createChangeTargetStyle<SetStyleWidthOrHeightFn>((value, property) => {
      return { [property]: getWidthOrHeight[property](value) };
    });
  }

  /** 初始化位移样式更新方法 */
  private setStyleOffsetUpdater() {
    if (this.options.offset) {
      const { name, beforeTranslateValueStr, afterTranslateValueStr } = this.domAttrs.transform;
      const getOffsetX = this.createChangeTargetValue('offsetX');
      const getOffsetY = this.createChangeTargetValue('offsetY');
      const offsetHandlerMap: Record<DomResizeOffsetType, (offsetX: number, offsetY: number) => DomResizeStyle> = {
        position: (offsetX, offsetY) => {
          return { left: getOffsetX(offsetX), top: getOffsetY(offsetY) };
        },
        transform: (offsetX, offsetY) => {
          // transform 不兼容customStyle自定义，固定px类型
          return { transform: `${name}(${beforeTranslateValueStr}${offsetX},${offsetY}${afterTranslateValueStr})` };
        },
        translate: (offsetX, offsetY) => {
          return { translate: `${getOffsetX(offsetX)} ${getOffsetY(offsetY)}` };
        },
      };
      this.setStyleOffset = this.createChangeTargetStyle(offsetHandlerMap[this.options.offset]);
    }
    else {
      this.setStyleOffset = () => ({});
    }
  }

  /** 创建改变target元素样式方法 */
  private createChangeTargetStyle<T extends (...params: any[]) => DomResizeStyle>(fn: T): T {
    if (!this.targetRef || this.options.disableUpdate) {
      // 获取不到实例或者关闭更新模式下，不进行样式设置
      return fn;
    }
    // 给传入的target元素设置样式
    return ((...params) => {
      const target = this.targetRef!.deref();
      const styles = fn(...params);
      if (!target) { return styles; } // 获取不到实例
      for (const key in styles) {
        (target.style as any)[key] = styles[key as keyof DomResizeStyle];
      }
      return styles;
    }) as T;
  }

  /** 创建改变target元素的值方法 */
  private createChangeTargetValue(key: keyof DomResizeCustomRender) {
    if (this.options.customRender?.[key]) {
      return (value: number) => this.options.customRender![key]!(
        value,
        {
          parentWidth: this.domAttrs.parentWidth,
          parentHeight: this.domAttrs.parentHeight,
          parentStyles: this.domAttrs.parentStyles,
          domStyles: this.domAttrs.domStyles,
        },
      );
    }
    return (value: number) => `${value}px`;
  }
}
