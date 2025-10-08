import type { DomDragContent, DomDragOptions, DomDragStyle } from '../types';
import { DragAxisParams } from './drag-axis-params';
import { DragDomAttrs } from './drag-dom-attrs';
import { DragHandler } from './drag-handler';
import { DragLogger } from './drag-logger';
import { DragStyleUpdater } from './drag-style-updater';

export class DragApplication {
  public options: DomDragOptions = {};
  public dragDomAttrs: DragDomAttrs;
  public dragAxisParams: DragAxisParams;
  public dragLogger: DragLogger;
  public dragStyleUpdater: DragStyleUpdater;
  public dragHandler: DragHandler;

  constructor(options?: DomDragOptions) {
    if (options) {
      this.options = options;
    }
    this.dragDomAttrs = new DragDomAttrs(this.options);
    this.dragAxisParams = new DragAxisParams(this.options, this.dragDomAttrs);
    this.dragLogger = new DragLogger(this.dragAxisParams);
    this.dragStyleUpdater = new DragStyleUpdater(this.options, this.dragDomAttrs);
    this.dragHandler = new DragHandler(this.dragAxisParams, this.dragLogger);
  }

  /** 清除配置的手动拖动 */
  public clearManual() {
    this.options.manual = undefined;
  }

  /** 清除配置的指针 */
  public clearPointer() {
    this.options.pointer = undefined;
  }

  private cacheDragContent: DomDragContent = {};

  /** 触发拖动事件 */
  public updateDrag(content: DomDragContent, styles: DomDragStyle) {
    this.cacheDragContent = content;
    this.options.callback?.(content, styles);
  }

  /** 指针活动开始 */
  public onPointerBegin() {
    this.cacheDragContent = {
      offsetX: this.dragDomAttrs.offsetX,
      offsetY: this.dragDomAttrs.offsetY,
    };
    this.options.onPointerBegin?.(this.cacheDragContent);
  }

  /** 指针活动 */
  public onPointerMove() {
    this.options.onPointerMove?.(this.cacheDragContent);
  }

  /** 指针活动结束 */
  public onPointerEnd() {
    this.options.onPointerEnd?.(this.cacheDragContent);
  }
}
