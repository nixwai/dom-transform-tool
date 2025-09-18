import type { Axis, Dir } from '../../typing';
import type { DomResizeContent, DomResizeOptions, DomResizeStyle } from '../types';
import { ResizeAxisParams } from './resize-axis-params';
import { ResizeDistance } from './resize-distance';
import { ResizeDistanceCounter } from './resize-distance-counter';
import { ResizeDomAttrs } from './resize-dom-attrs';
import { ResizeHandler } from './resize-handler';
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

type ResizeDirectionFn = (resizeData: ResizeApplication, ...resizingFns: ResizingFn[]) => void;

export class ResizeApplication {
  public options: DomResizeOptions = {};
  public resizeDomAttrs: ResizeDomAttrs;
  public resizeDistance: ResizeDistance;
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
    this.resizeDistance = new ResizeDistance(this.resizeAxisParams, this.resizeDomAttrs);
    this.resizeDistanceCounter = new ResizeDistanceCounter(this.options, this.resizeAxisParams);
    this.resizeOffsetCounter = new ResizeOffsetCounter(this.options, this.resizeDomAttrs);
    this.resizeHandler = new ResizeHandler(this.options, this.resizeAxisParams, this.resizeDistanceCounter, this.resizeOffsetCounter, this.resizeDistance);
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
        resizeHorizontal(this, resizingBackward);
        break;
      case 'right':
        resizeHorizontal(this, resizingForward);
        break;
      case 'left-right':
        resizeHorizontal(this, resizingBoth);
        break;
      case 'top':
        resizeVertical(this, resizingBackward);
        break;
      case 'bottom':
        resizeVertical(this, resizingForward);
        break;
      case 'top-bottom':
        resizeVertical(this, resizingBoth);
        break;
      case 'left-top':
        resizeHorizontalAndVertical(this, resizingBackward, resizingBackward);
        break;
      case 'right-top':
        resizeHorizontalAndVertical(this, resizingForward, resizingBackward);
        break;
      case 'left-bottom':
        resizeHorizontalAndVertical(this, resizingBackward, resizingForward);
        break;
      case 'right-bottom':
        resizeHorizontalAndVertical(this, resizingForward, resizingForward);
        break;
      case 'left-bottom-right':
        resizeHorizontalAndVertical(this, resizingBoth, resizingForward);
        break;
      case 'left-top-right':
        resizeHorizontalAndVertical(this, resizingBoth, resizingBackward);
        break;
      case 'top-left-bottom':
        resizeHorizontalAndVertical(this, resizingBackward, resizingBoth);
        break;
      case 'top-right-bottom':
        resizeHorizontalAndVertical(this, resizingForward, resizingBoth);
        break;
      case 'all':
        resizeHorizontalAndVertical(this, resizingBoth, resizingBoth);
        break;
    }
  }
}
