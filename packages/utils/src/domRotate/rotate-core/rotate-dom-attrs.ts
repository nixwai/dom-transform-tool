import type { DomRotateOptions } from '../types';
import { DomVariant } from '../../base';
import { toNum } from '../../utils';

export class RotateDomAttrs {
  /** 鼠标位置, 位于元素变化原点的相对位置以及角度 */
  public pointerPosition = { x: 0, y: 0, deg: 0 };
  /** 元素变化原点位置 */
  public transformOrigin = { x: 0, y: 0 };
  /** 元素变化属性信息 */
  public variant = new DomVariant();

  constructor(private options: DomRotateOptions) {
    this.updateTargetAttrsInfo();
  }

  /** 更新目标属性信息 */
  private updateTargetAttrsInfo() {
    if (!this.options.target) { return; }
    const domStyles = window.getComputedStyle(this.options.target, null);
    this.variant.setTransform(domStyles);
    this.variant.setRotate(domStyles);
    this.variant.setTransformOrigin(domStyles);
    this.setTransformOrigin(domStyles.transformOrigin);
    this.setPointerPosition(domStyles);
  }

  private setTransformOrigin(transformOrigin: string | string[]) {
    const transformOriginStr = new Array<string>().concat(transformOrigin).join(' ');
    const transformOriginList = transformOriginStr.split(/\s+/);
    this.transformOrigin.x = toNum(transformOriginList[0]);
    this.transformOrigin.y = toNum(transformOriginList[1]);
  }

  private setPointerPosition(domStyles: CSSStyleDeclaration) {
    if (!this.options.target || !this.options.pointer) {
      return;
    }

    const rect = this.options.target.getBoundingClientRect();
    // 旋转角度，其值在-360~360之间
    const rotateAngle = this.variant.rotate % 360;
    // 将角度标准化到 [-180, 180] 范围
    let normalizedAngle = rotateAngle;
    if (rotateAngle > 180) { normalizedAngle = rotateAngle - 360; }
    else if (rotateAngle < -180) { normalizedAngle = rotateAngle + 360; }
    // 计算变换原点坐标
    const transformOriginX = this.transformOrigin.x;
    const transformOriginY = this.transformOrigin.y;
    const acuteRotate = Math.abs(normalizedAngle) > 90
      ? 180 - Math.abs(normalizedAngle)
      : Math.abs(normalizedAngle); // 转化为锐角，其值在0~90之间
    const angleRad = acuteRotate * Math.PI / 180;
    const angleSin = Math.sin(angleRad);
    const angleCos = Math.cos(angleRad);
    const height = toNum(domStyles.height);

    // 获取旋转后的变形原点位置
    let transformOriginCoordX = 0;
    let transformOriginCoordY = 0;
    if (Math.abs(normalizedAngle) > 90 && normalizedAngle < 0) {
      transformOriginCoordX = rect.right - transformOriginX * angleCos - (height - transformOriginY) * angleSin;
      transformOriginCoordY = rect.bottom - transformOriginX * angleSin - transformOriginY * angleCos;
    }
    else if (Math.abs(normalizedAngle) >= 90 && normalizedAngle >= 0) {
      transformOriginCoordX = rect.right - transformOriginX * angleCos - transformOriginY * angleSin;
      transformOriginCoordY = rect.top + transformOriginX * angleSin + (height - transformOriginY) * angleCos;
    }
    else if (Math.abs(normalizedAngle) < 90 && normalizedAngle > 0) {
      transformOriginCoordX = rect.left + transformOriginX * angleCos + (height - transformOriginY) * angleSin;
      transformOriginCoordY = rect.top + transformOriginX * angleSin + transformOriginY * angleCos;
    }
    else if (Math.abs(normalizedAngle) <= 90 && normalizedAngle <= 0) {
      transformOriginCoordX = rect.left + transformOriginX * angleCos + transformOriginY * angleSin;
      transformOriginCoordY = rect.bottom - transformOriginX * angleSin - (height - transformOriginY) * angleCos;
    }
    // 鼠标相对于元素变化原点的位置
    this.pointerPosition.x = this.options.pointer.clientX - transformOriginCoordX;
    this.pointerPosition.y = this.options.pointer.clientY - transformOriginCoordY;
    this.pointerPosition.deg = Math.atan2(this.pointerPosition.y, this.pointerPosition.x) * (180 / Math.PI);
  }
}
