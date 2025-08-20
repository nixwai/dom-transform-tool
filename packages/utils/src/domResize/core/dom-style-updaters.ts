import type { DomResizeOptions, DomResizeStyle } from '../types';
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

  const changeTargetStyle = <T extends (...params: any[]) => DomResizeStyle>(fn: T): T => {
    if (!target || options.customControl) {
      // 获取不到实例或者自定义控制模式下，不进行样式设置
      return fn;
    }
    // 非自定义控制模式下，自动设置元素样式
    return ((...params) => {
      const styles = fn(...params);
      for (const key in styles) {
        (target.style as any)[key] = styles[key as keyof DomResizeStyle];
      }
      return styles;
    }) as T;
  };
  /** 设置宽度或高度 */
  const setStyleWidthOrHeight = changeTargetStyle<SetStyleWidthOrHeightFn>((value, property) => {
    return { [property]: `${value}px` };
  });
  /** 设置位移 */
  let setStyleOffset: SetStyleOffset = () => ({});
  if (options.offset === 'position') {
    setStyleOffset = changeTargetStyle((left, top) => {
      return {
        left: `${left}px`,
        top: `${top}px`,
      };
    });
  }
  else if (options.offset === 'transform') {
    setStyleOffset = changeTargetStyle((translateX, translateY) => {
      return { transform: `${name}(${beforeTranslateValueStr}${translateX},${translateY}${afterTranslateValueStr})` };
    });
  }
  else if (options.offset === 'translate') {
    setStyleOffset = changeTargetStyle((translateX, translateY) => {
      return { translate: `${translateX}px ${translateY}px` };
    });
  }

  return {
    setStyleWidthOrHeight,
    setStyleOffset,
  };
}
