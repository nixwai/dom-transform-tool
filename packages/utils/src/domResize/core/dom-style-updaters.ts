import type { DomResizeCustomStyle, DomResizeOffsetType, DomResizeOptions, DomResizeStyle } from '../types';
import type { DomAttrs } from './dom-attrs';

export type SetStyleWidthOrHeightFn = (value: number, property: 'width' | 'height') => DomResizeStyle;
export type SetStyleOffset = (offsetX: number, offsetY: number) => DomResizeStyle;

/** 创建样式更新函数 */
export function createStyleUpdaters(
  targetRef: WeakRef<HTMLDivElement>,
  options: DomResizeOptions,
  domAttrs: DomAttrs,
) {
  const { name, beforeTranslateValueStr, afterTranslateValueStr } = domAttrs.transform;
  const target = targetRef.deref();

  const createChangeTargetStyle = <T extends (...params: any[]) => DomResizeStyle>(fn: T): T => {
    if (!target || options.disableUpdate) {
      // 获取不到实例或者关闭更新模式下，不进行样式设置
      return fn;
    }
    // 自动设置元素样式
    return ((...params) => {
      const styles = fn(...params);
      for (const key in styles) {
        (target.style as any)[key] = styles[key as keyof DomResizeStyle];
      }
      return styles;
    }) as T;
  };

  const createGetResizeValue = (key: keyof DomResizeCustomStyle) => options.customStyle?.[key]
    ? (value: number) => options.customStyle![key]!(
        value,
        {
          parentWidth: domAttrs.parentWidth,
          parentHeight: domAttrs.parentHeight,
          parentStyles: domAttrs.parentStyles,
          domStyles: domAttrs.styles,
        },
      )
    : (value: number) => `${value}px`;

  const getWidthOrHeight = {
    width: createGetResizeValue('width'),
    height: createGetResizeValue('height'),
  };
  /** 设置宽度或高度 */
  const setStyleWidthOrHeight = createChangeTargetStyle<SetStyleWidthOrHeightFn>((value, property) => {
    return { [property]: getWidthOrHeight[property](value) };
  });

  /** 设置位移 */
  let setStyleOffset: SetStyleOffset = () => ({});
  if (options.offset) {
    const getOffsetX = createGetResizeValue('offsetX');
    const getOffsetY = createGetResizeValue('offsetY');
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
    setStyleOffset = createChangeTargetStyle(offsetHandlerMap[options.offset]);
  }

  return {
    setStyleWidthOrHeight,
    setStyleOffset,
  };
}
