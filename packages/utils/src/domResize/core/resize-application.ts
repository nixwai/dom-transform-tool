import type { DomResizeContent, DomResizeOptions, DomResizeStyle } from '../types';
import type { Axis, Dir } from '../typing';
import { AxisParams } from './axis-params';
import { DistanceCounter } from './distance-counter';
import { DomAttrs } from './dom-attrs';
import { OffsetCounter } from './offset-counter';
import { ResizeDistance } from './resize-distance';
import { ResizeHandler } from './resize-handler';
import { StyleUpdater } from './style-updater';

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
  public domAttrs: DomAttrs;
  public resizeDistance: ResizeDistance;
  public axisParams: AxisParams;
  private distanceCounter: DistanceCounter;
  public offsetCounter: OffsetCounter;
  public resizeHandler: ResizeHandler;
  public styleUpdater: StyleUpdater;

  constructor(options?: DomResizeOptions) {
    if (options) {
      this.options = options;
    }
    this.domAttrs = new DomAttrs(this.options);
    this.axisParams = new AxisParams(this.options, this.domAttrs);
    this.resizeDistance = new ResizeDistance(this.axisParams);
    this.distanceCounter = new DistanceCounter(this.options, this.axisParams);
    this.offsetCounter = new OffsetCounter(this.options, this.domAttrs);
    this.resizeHandler = new ResizeHandler(this.options, this.axisParams, this.distanceCounter, this.offsetCounter, this.resizeDistance);
    this.styleUpdater = new StyleUpdater(this.options, this.domAttrs);
  }

  /** 更新实例配置 */
  public updateInstance(options?: DomResizeOptions) {
    if (options) {
      this.options = Object.assign({}, this.options, options);
      this.domAttrs.updateDomAttrs(this.options, options.target);
      this.axisParams.updateAxisParams(this.options);
      this.resizeDistance.updateResizeDistance(options.target);
      this.distanceCounter.updateDistanceCounter(this.options);
      this.offsetCounter.updateOffsetCounter(this.options);
      this.resizeHandler.updateResizeHandler(this.options);
      this.styleUpdater.updateStyleUpdater(this.options);
    }
  }

  /** 清除配置的手动调整 */
  public clearManual() {
    this.options.manual = undefined;
  }

  /** 清除配置的指针 */
  public clearPointer() {
    this.options.pointer = undefined;
  }

  /** 触发调整事件 */
  public updateResize(content: DomResizeContent, styles: DomResizeStyle) {
    this.options.callback?.(content, styles);
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
