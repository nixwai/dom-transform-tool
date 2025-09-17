import type { DomResizeOptions } from '../types';
import type { Dir } from '../typing';
import { DomSize, DomVariant } from '../../core';
import { toNum } from '../../utils';

export class DomAttrs {
  /** 水平偏移值 */
  offsetX: number = 0;
  /** 垂直偏移值 */
  offsetY: number = 0;

  /** 鼠标位置 */
  pointerDir: {
    /** 水平方向，1: 前方，-1: 后方 */
    x: Dir
    /** 垂直方向，1: 前方，-1: 后方 */
    y: Dir
  } = { x: 1, y: 1 };

  public variant = new DomVariant();
  public size = new DomSize();

  constructor(private options: DomResizeOptions) {
    this.updateTargetAttrsInfo();
    this.updateSizeConstraints();
    this.updateOffsetInfo();
    this.updatePointerDirection();
    this.customDomAttrs();
  }

  /** 当前元素信息是否发生改变 */
  public isTargetAttrsUpdate = false;
  /** 当前元素偏移是否发生改变 */
  public isOffsetUpdate = false;

  public updateDomAttrs(options: DomResizeOptions, recount: boolean) {
    this.isTargetAttrsUpdate = false;
    this.isOffsetUpdate = false;

    const isChangeTarget = this.options.target !== options.target;
    const taskList: [unknown, () => void][] = [
      [
        recount || isChangeTarget,
        () => {
          this.updateTargetAttrsInfo();
          this.isTargetAttrsUpdate = true;
        },
      ],
      [
        recount || isChangeTarget || options.lockAspectRatio !== this.options.lockAspectRatio,
        () => {
          this.updateSizeConstraints();
          this.isTargetAttrsUpdate = true;
        },
      ],
      [
        recount || isChangeTarget || options.offset !== this.options.offset,
        () => {
          this.updateOffsetInfo();
          this.isOffsetUpdate = true;
        },
      ],
    ];
    this.options = options;
    taskList.forEach(([condition, fn]) => {
      if (condition) { fn.call(this); }
    });
    this.updatePointerDirection();
  }

  /** 更新目标属性信息 */
  private updateTargetAttrsInfo() {
    if (!this.options.target) { return; }
    const domStyles = window.getComputedStyle(this.options.target, null);
    const parentStyles = window.getComputedStyle(this.options.target.parentNode as HTMLDivElement, null);
    this.size.setSizeInfo(domStyles, parentStyles);
    this.variant.setVariantInfo(domStyles, this.options.target?.style?.transformOrigin);
  }

  private updateSizeConstraints() {
    this.size.lockWidthHeightRatio(this.options.lockAspectRatio || false);
  }

  /** 初始化指针点击的位置 */
  private updatePointerDirection() {
    if (!this.options.target) { return; }
    if (!this.options.pointer) {
      this.pointerDir.x = 1;
      this.pointerDir.y = 1;
      return;
    }

    const rect = this.options.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // 鼠标相对于元素中心的坐标
    const pointerX = this.options.pointer.clientX - centerX;
    const pointerY = this.options.pointer.clientY - centerY;
    // 旋转角度（转换为弧度）
    const angleRad = -this.variant.rotate * Math.PI / 180;
    // 应用逆时针旋转矩阵
    const rotatedX = pointerX * Math.cos(angleRad) - pointerY * Math.sin(angleRad);
    const rotatedY = pointerX * Math.sin(angleRad) + pointerY * Math.cos(angleRad);
    // 根据旋转后的坐标判断方向
    this.pointerDir.x = rotatedX > 0 ? 1 : -1;
    this.pointerDir.y = rotatedY > 0 ? 1 : -1;
  }

  /** 更新偏移信息 */
  private updateOffsetInfo() {
    if (this.options.offset === 'position') {
      this.offsetX = this.variant.positionLeft;
      this.offsetY = this.variant.positionTop;
    }
    else if (this.options.offset === 'translate') {
      this.offsetX = this.variant.translateX;
      this.offsetY = this.variant.translateY;
    }
    else {
      if (this.variant.transformValue.length > 6) {
        this.offsetX = this.variant.transformValue[12];
        this.offsetY = this.variant.transformValue[13];
      }
      else {
        this.offsetX = this.variant.transformValue[4];
        this.offsetY = this.variant.transformValue[5];
      }
    }
  }

  /** 自定义信息 */
  private customDomAttrs() {
    if (this.options.customStyle?.rotate !== undefined) {
      this.variant.rotate = toNum(String(this.options.customStyle.rotate));
    }
    if (this.options.customStyle?.scale !== undefined) {
      const scaleList = new Array<string | number>().concat(this.options.customStyle.scale).join(' ').split(/\s+/);
      this.variant.scaleX = toNum(scaleList[0]);
      this.variant.scaleY = toNum(scaleList[1] || scaleList[0]);
    }
    if (this.options.customStyle?.transformOrigin !== undefined) {
      this.variant.resolveTransformOrigin(this.options.customStyle.transformOrigin);
    }
  }
}
