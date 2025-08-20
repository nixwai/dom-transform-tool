import type { DomResizeContent, DomResizeOptions, DomResizeStyle } from '../types';
import type { Dir, DomAttrs } from './dom-attrs';
import type { SetStyleOffset, SetStyleWidthOrHeightFn } from './dom-style-updaters';
import type { ResizeDistance } from './resizing-fns';
import { getResizeDomAttrs } from './dom-attrs';
import { createStyleUpdaters } from './dom-style-updaters';
import { createResizingFns } from './resizing-fns';

export type Axis = 'x' | 'y';

/**
 * 调节函数
 * @param startLocation 开始的坐标
 * @param endLocation 结束的坐标
 * @param axis 坐标
 * @param pointerDir 鼠标点击的方向
 */
export type ResizingFn =
  (startLocation: number, endLocation: number, axis: Axis, pointerDir?: Dir) => { value: number, offset: number, otherOffset: number };

export type ResizeData = Readonly<{
  /** 元素弱引用类型 */
  targetRef: WeakRef<HTMLDivElement>
  /** 传入的配置项 */
  options: Readonly<DomResizeOptions>
  /** 元素的属性信息 */
  domAttrs: Readonly<DomAttrs>
  /** 记录每次更新的位移距离 */
  moveDistance: ResizeDistance
  /** 设置宽度或高度 */
  setStyleWidthOrHeight: SetStyleWidthOrHeightFn
  /** 设置位移 */
  setStyleOffset: SetStyleOffset
  /** 向前调整（往右或者往下）后长度值与位移值 */
  resizingForward: ResizingFn
  /** 向后调整（往左或者往上）后长度值与位移值 */
  resizingBackward: ResizingFn
  /** 前后一起调整 */
  resizingBoth: ResizingFn
}>;

/** 初始化调整操作功能 */
export function initResize(options: DomResizeOptions): ResizeData {
  const targetRef = new WeakRef(options.target!);
  const domAttrs = getResizeDomAttrs(options, targetRef.deref());
  const { setStyleWidthOrHeight, setStyleOffset } = createStyleUpdaters(targetRef, options, domAttrs);
  const { moveDistance, resizingForward, resizingBackward, resizingBoth } = createResizingFns(options, domAttrs);

  return {
    targetRef,
    options,
    domAttrs,
    moveDistance,
    setStyleWidthOrHeight,
    setStyleOffset,
    resizingForward,
    resizingBackward,
    resizingBoth,
  };
}

/** 触发调整事件 */
export function updateResize(resizeData: ResizeData, content: DomResizeContent, styles: DomResizeStyle) {
  resizeData.options.callback?.(content, styles);
}

type ResizeDirectionFn = (resizeData: ResizeData, ...resizingFns: ResizingFn[]) => void;

/** 根据方向调整 */
export function resizeByDirection(
  resizeData: ResizeData,
  resizeHorizontal: ResizeDirectionFn,
  resizeVertical: ResizeDirectionFn,
  resizeHorizontalAndVertical: ResizeDirectionFn,
) {
  const { options, resizingBackward, resizingForward, resizingBoth } = resizeData;

  switch (options.direction) {
    case 'left':
      resizeHorizontal(resizeData, resizingBackward);
      break;
    case 'right':
      resizeHorizontal(resizeData, resizingForward);
      break;
    case 'left-right':
      resizeHorizontal(resizeData, resizingBoth);
      break;
    case 'top':
      resizeVertical(resizeData, resizingBackward);
      break;
    case 'bottom':
      resizeVertical(resizeData, resizingForward);
      break;
    case 'top-bottom':
      resizeVertical(resizeData, resizingBoth);
      break;
    case 'left-top':
      resizeHorizontalAndVertical(resizeData, resizingBackward, resizingBackward);
      break;
    case 'right-top':
      resizeHorizontalAndVertical(resizeData, resizingForward, resizingBackward);
      break;
    case 'left-bottom':
      resizeHorizontalAndVertical(resizeData, resizingBackward, resizingForward);
      break;
    case 'right-bottom':
      resizeHorizontalAndVertical(resizeData, resizingForward, resizingForward);
      break;
    case 'left-bottom-right':
      resizeHorizontalAndVertical(resizeData, resizingBoth, resizingForward);
      break;
    case 'left-top-right':
      resizeHorizontalAndVertical(resizeData, resizingBoth, resizingBackward);
      break;
    case 'top-left-bottom':
      resizeHorizontalAndVertical(resizeData, resizingBackward, resizingBoth);
      break;
    case 'top-right-bottom':
      resizeHorizontalAndVertical(resizeData, resizingForward, resizingBoth);
      break;
    case 'all':
      resizeHorizontalAndVertical(resizeData, resizingBoth, resizingBoth);
      break;
  }
}
