import type { Axis, Dir } from '../../typing';
import type { DomResizeContent, DomResizeOptions, DomResizeStyle } from '../types';
import { ResizeAxisParams } from './resize-axis-params';
import { ResizeDistanceCounter } from './resize-distance-counter';
import { ResizeDomAttrs } from './resize-dom-attrs';
import { ResizeHandler } from './resize-handler';
import { ResizeLogger } from './resize-logger';
import { ResizeOffsetCounter } from './resize-offset-counter';
import { ResizeStyleUpdater } from './resize-style-updater';

/**
 * 调节函数
 * @param startLocation 开始的坐标
 * @param endLocation 结束的坐标
 * @param axis 坐标
 * @param pointerDir 鼠标点击的方向
 */
export type ResizingFn =
  (startLocation: number, endLocation: number, axis: Axis, pointerDir?: Dir) => { value: number, offset: number, otherOffset: number };

type ResizeDirectionFn = (resizeData: ResizeApplication, ...resizingFns: ResizingFn[]) => ((overEvent: PointerEvent) => void) | void;

export class ResizeApplication {
  public options: DomResizeOptions = {};
  public resizeDomAttrs: ResizeDomAttrs;
  public resizeLogger: ResizeLogger;
  public resizeAxisParams: ResizeAxisParams;
  private resizeDistanceCounter: ResizeDistanceCounter;
  public resizeOffsetCounter: ResizeOffsetCounter;
  public resizeHandler: ResizeHandler;
  public resizeStyleUpdater: ResizeStyleUpdater;

  constructor(options?: DomResizeOptions) {
    if (options) {
      this.options = options;
    }
    this.resizeDomAttrs = new ResizeDomAttrs(this.options);
    this.resizeAxisParams = new ResizeAxisParams(this.options, this.resizeDomAttrs);
    this.resizeLogger = new ResizeLogger(this.resizeAxisParams);
    this.resizeDistanceCounter = new ResizeDistanceCounter(this.options, this.resizeAxisParams);
    this.resizeOffsetCounter = new ResizeOffsetCounter(this.options, this.resizeDomAttrs);
    this.resizeHandler = new ResizeHandler(this.options, this.resizeAxisParams, this.resizeDistanceCounter, this.resizeOffsetCounter, this.resizeLogger);
    this.resizeStyleUpdater = new ResizeStyleUpdater(this.options, this.resizeDomAttrs);
  }

  /** 清除配置的手动调整 */
  public clearManual() {
    this.options.manual = undefined;
  }

  /** 清除配置的指针 */
  public clearPointer() {
    this.options.pointer = undefined;
  }

  private cacheResizeContent: DomResizeContent = {};

  /** 触发调整事件 */
  public updateResize(content: DomResizeContent, styles: DomResizeStyle) {
    this.cacheResizeContent = content;
    this.options.callback?.(content, styles);
  }

  /** 指针活动开始 */
  public onPointerBegin() {
    this.cacheResizeContent = {
      width: this.resizeDomAttrs.size.width,
      height: this.resizeDomAttrs.size.height,
      offsetX: this.resizeDomAttrs.offsetX,
      offsetY: this.resizeDomAttrs.offsetY,
    };
    this.options.onPointerBegin?.(this.cacheResizeContent);
  }

  /** 指针活动 */
  public onPointerMove() {
    this.options.onPointerMove?.(this.cacheResizeContent);
  }

  /** 指针活动结束 */
  public onPointerEnd() {
    this.options.onPointerEnd?.(this.cacheResizeContent);
  }

  /** 根据方向调整 */
  public resizeByDirection(
    resizeHorizontal: ResizeDirectionFn,
    resizeVertical: ResizeDirectionFn,
    resizeHorizontalAndVertical: ResizeDirectionFn,
  ) {
    const { resizingBackward, resizingForward, resizingBoth } = this.resizeHandler;

    switch (this.options.direction) {
      case 'left':
        return resizeHorizontal(this, resizingBackward);

      case 'right':
        return resizeHorizontal(this, resizingForward);

      case 'left-right':
        return resizeHorizontal(this, resizingBoth);

      case 'top':
        return resizeVertical(this, resizingBackward);

      case 'bottom':
        return resizeVertical(this, resizingForward);

      case 'top-bottom':
        return resizeVertical(this, resizingBoth);

      case 'left-top':
        return resizeHorizontalAndVertical(this, resizingBackward, resizingBackward);

      case 'right-top':
        return resizeHorizontalAndVertical(this, resizingForward, resizingBackward);

      case 'left-bottom':
        return resizeHorizontalAndVertical(this, resizingBackward, resizingForward);

      case 'right-bottom':
        return resizeHorizontalAndVertical(this, resizingForward, resizingForward);

      case 'left-bottom-right':
        return resizeHorizontalAndVertical(this, resizingBoth, resizingForward);

      case 'left-top-right':
        return resizeHorizontalAndVertical(this, resizingBoth, resizingBackward);

      case 'top-left-bottom':
        return resizeHorizontalAndVertical(this, resizingBackward, resizingBoth);

      case 'top-right-bottom':
        return resizeHorizontalAndVertical(this, resizingForward, resizingBoth);

      case 'all':
        return resizeHorizontalAndVertical(this, resizingBoth, resizingBoth);
    }
  }
}
