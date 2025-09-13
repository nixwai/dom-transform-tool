import type { DomResizeCustomRender, DomResizeOffsetType, DomResizeOptions, DomResizeStyle } from '../types';
import type { DomAttrs } from './dom-attrs';

/** 设置宽或者高样式 */
export type SetStyleWidthOrHeightFn = (value: number, property: 'width' | 'height') => DomResizeStyle;
/** 设置位移样式 */
export type SetStyleOffset = (valueX: number, valueY: number) => DomResizeStyle;

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
    const isStyleUpdaterUpdate = Boolean(
      options.target !== this.options.target
      || options.offset !== this.options.offset
      || options.customRender !== this.options.customRender
      || options.disableUpdate !== this.options.disableUpdate,
    );
    this.options = options;

    if (isStyleUpdaterUpdate) {
      this.targetRef = options.target ? new WeakRef(options.target) : undefined;
      this.setStyleWidthHeightUpdater();
      this.setStyleOffsetUpdater();
    }
  }

  /** 设置宽高样式更新方法 */
  private setStyleWidthHeightUpdater() {
    const getWidthOrHeight = {
      width: this.createChangeTargetValue('width'),
      height: this.createChangeTargetValue('height'),
    };

    this.setStyleWidthOrHeight = this.createChangeTargetStyle<SetStyleWidthOrHeightFn>((value, property) => {
      return { [property]: getWidthOrHeight[property](value) };
    });
  }

  private cachedStyleOffset: Record<DomResizeOffsetType, { valueX: number, valueY: number, originX?: number, originY?: number }> = {
    position: { valueX: 0, valueY: 0 },
    transform: { valueX: 0, valueY: 0 },
    translate: { valueX: 0, valueY: 0 },
  };

  /** 设置位移样式更新方法 */
  private setStyleOffsetUpdater() {
    if (this.options.offset) {
      const { name, beforeTranslateValueStr, afterTranslateValueStr } = this.domAttrs.transform;
      const getOffsetX = this.createChangeTargetValue('offsetX');
      const getOffsetY = this.createChangeTargetValue('offsetY');

      const offsetDiff = Object.entries(this.cachedStyleOffset)
        .filter(([key]) => key !== this.options.offset)
        .reduce((acc, [_key, { valueX, valueY, originX, originY }]) => {
          return { x: acc.x += valueX - (originX || 0), y: acc.y += valueY - (originY || 0) };
        }, { x: 0, y: 0 });

      if (this.cachedStyleOffset[this.options.offset].originX !== undefined) {
        offsetDiff.x += this.domAttrs.offsetX - this.cachedStyleOffset[this.options.offset].originX!;
      }
      else {
        this.cachedStyleOffset[this.options.offset].originX = this.domAttrs.offsetX;
      }

      if (this.cachedStyleOffset[this.options.offset].originY !== undefined) {
        offsetDiff.y += this.domAttrs.offsetY - this.cachedStyleOffset[this.options.offset].originY!;
      }
      else {
        this.cachedStyleOffset[this.options.offset].originY = this.domAttrs.offsetY;
      }

      const offsetHandlerMap: Record<DomResizeOffsetType, SetStyleOffset> = {
        position: (valueX, valueY) => {
          return { left: getOffsetX(valueX), top: getOffsetY(valueY) };
        },
        transform: (valueX, valueY) => {
          // transform 不兼容customStyle自定义，固定px类型
          return { transform: `${name}(${beforeTranslateValueStr}${valueX},${valueY}${afterTranslateValueStr})` };
        },
        translate: (valueX, valueY) => {
          return { translate: `${getOffsetX(valueX)} ${getOffsetY(valueY)}` };
        },
      };

      const logStyleOffset = (realX: number, realY: number) => {
        this.cachedStyleOffset[this.options.offset!].valueX = realX;
        this.cachedStyleOffset[this.options.offset!].valueY = realY;
      };

      this.setStyleOffset = this.createChangeTargetStyle<SetStyleOffset>((valueX, valueY) => {
        const realX = valueX - offsetDiff.x;
        const realY = valueY - offsetDiff.y;
        logStyleOffset(realX, realY);
        return offsetHandlerMap[this.options.offset!](realX, realY);
      });
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
