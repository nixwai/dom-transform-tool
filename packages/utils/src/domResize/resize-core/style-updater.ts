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

  /** 缓存位移样式 */
  private cachedStyleOffset: Record<DomResizeOffsetType, { valueX: number, valueY: number }> = {
    position: { valueX: 0, valueY: 0 },
    transform: { valueX: 0, valueY: 0 },
    translate: { valueX: 0, valueY: 0 },
  };

  constructor(private options: DomResizeOptions, private domAttrs: DomAttrs) {
    if (options.target) {
      this.targetRef = new WeakRef(options.target);
    }
    this.setStyleWidthHeightUpdater();
    this.setStyleOffsetUpdater();
  }

  public updateStyleUpdater(options: DomResizeOptions) {
    if (this.domAttrs.isTargetAttrsUpdate) {
      this.resetCachedStyleOffset();
    }

    const isStyleUpdaterUpdate = Boolean(
      this.domAttrs.isTargetAttrsUpdate
      || options.offset !== this.options.offset
      || options.disableUpdate !== this.options.disableUpdate,
    );
    this.options = options;

    if (isStyleUpdaterUpdate) {
      this.targetRef = options.target ? new WeakRef(options.target) : undefined;
      this.setStyleWidthHeightUpdater();
      this.setStyleOffsetUpdater();
    }
  }

  private resetCachedStyleOffset() {
    this.cachedStyleOffset = {
      position: { valueX: 0, valueY: 0 },
      transform: { valueX: 0, valueY: 0 },
      translate: { valueX: 0, valueY: 0 },
    };
  }

  /** 设置宽高样式更新方法 */
  private setStyleWidthHeightUpdater() {
    const getWidthOrHeight = {
      width: this.changeByCustomRender('width'),
      height: this.changeByCustomRender('height'),
    };

    this.setStyleWidthOrHeight = this.createChangeTargetStyle<SetStyleWidthOrHeightFn>((value, property) => {
      return { [property]: getWidthOrHeight[property](value) };
    });
  }

  /** 设置位移样式更新方法 */
  private setStyleOffsetUpdater() {
    if (this.options.offset) {
      const offsetDiff = Object.entries(this.cachedStyleOffset)
        .filter(([key]) => key !== this.options.offset)
        .reduce((acc, [_key, { valueX, valueY }]) => ({ x: acc.x += valueX, y: acc.y += valueY }), { x: 0, y: 0 });

      const logStyleOffset = (realX: number, realY: number) => {
        this.cachedStyleOffset[this.options.offset!].valueX = realX - this.domAttrs.offsetX;
        this.cachedStyleOffset[this.options.offset!].valueY = realY - this.domAttrs.offsetY;
      };

      const offsetHandler = this.createOffsetHandler();

      this.setStyleOffset = this.createChangeTargetStyle<SetStyleOffset>((valueX, valueY) => {
        const realX = valueX - offsetDiff.x;
        const realY = valueY - offsetDiff.y;
        logStyleOffset(realX, realY);
        return offsetHandler(realX, realY);
      });
    }
    else {
      this.setStyleOffset = () => ({});
    }
  }

  /** 获取位移修改函数 */
  private createOffsetHandler(): SetStyleOffset {
    const getOffsetX = this.changeByCustomRender('offsetX');
    const getOffsetY = this.changeByCustomRender('offsetY');
    // 使用position
    if (this.options.offset === 'position') {
      return (valueX, valueY) => {
        return { left: getOffsetX(valueX), top: getOffsetY(valueY) };
      };
    }
    // 使用translate
    if (this.options.offset === 'translate') {
      return (valueX, valueY) => {
        return { translate: `${getOffsetX(valueX)} ${getOffsetY(valueY)}` };
      };
    }
    // 使用transform
    if (this.options.offset === 'transform') {
      const { transformName, transformValue } = this.domAttrs.variant;
      let beforeTransformValueStr = '';
      let afterTransformValueStr = '';
      if (transformValue.length > 6) {
        // matrix3d(https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/matrix3d)
        beforeTransformValueStr = `${transformValue.slice(0, 12).join(',')},`;
        afterTransformValueStr = `,${transformValue.slice(15).join(',')}`;
      }
      else {
        // matrix(https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/matrix)
        beforeTransformValueStr = `${transformValue.slice(0, 4).join(',')},`;
        afterTransformValueStr = '';
      }
      return (valueX, valueY) => {
        // transform 不兼容customStyle自定义，固定px类型
        return { transform: `${transformName}(${beforeTransformValueStr}${valueX},${valueY}${afterTransformValueStr})` };
      };
    }

    return () => ({});
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
  private changeByCustomRender(key: keyof DomResizeCustomRender) {
    return (value: number) => this.options.customRender?.[key]?.(
      value,
      { parentWidth: this.domAttrs.size.parentWidth, parentHeight: this.domAttrs.size.parentHeight },
    ) ?? `${value}px`;
  }
}
