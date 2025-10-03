import type { DomScaleCustomRender, DomScaleOptions, DomScaleStyle } from '../types';
import type { ScaleDomAttrs } from './scale-dom-attrs';
import { createDomStyleUpdateMethod } from '../../utils';

type SetStyleRotate = (scaleX: number, scaleY: number) => DomScaleStyle;

export class ScaleStyleUpdater {
  private targetRef?: WeakRef<HTMLElement>;

  public setStyleRotate: SetStyleRotate = () => ({});

  constructor(private options: DomScaleOptions, private scaleDomAttrs: ScaleDomAttrs) {
    if (options.target) {
      this.targetRef = new WeakRef(options.target);
    }
    this.setStyleRotateUpdater();
  }

  /** 设置样式更新方法 */
  private setStyleRotateUpdater() {
    this.setStyleRotate = createDomStyleUpdateMethod<SetStyleRotate, DomScaleStyle>(
      this.createGetScaleStyle(),
      this.targetRef,
      this.options.disableUpdate,
    );
  }

  /** 创建改变target元素的值方法 */
  private changeByCustomRender(key: keyof DomScaleCustomRender) {
    return (scaleX: number, scaleY: number) => {
      const customRender = this.options.customRender?.[key];
      const customValue = customRender?.(scaleX, scaleY);
      return customValue ?? `${scaleX} ${scaleY}`;
    };
  }

  /** 获取位移修改函数 */
  private createGetScaleStyle(): SetStyleRotate {
    const getScale = this.changeByCustomRender('scale');
    // 使用transform
    if (this.options.scaleType === 'transform') {
      const { transformName, transformValue, transformRotate } = this.scaleDomAttrs.variant;
      let afterTransformValueStr = '';
      const is3DTransform = transformValue.length > 6;
      if (is3DTransform) {
        // matrix3d(https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/matrix3d)
        afterTransformValueStr = transformValue.slice(6).join(',');
      }
      else {
        // matrix(https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/matrix)
        afterTransformValueStr = transformValue.slice(4).join(',');
      }
      // transform 不兼容customStyle自定义
      const cos = Math.cos(transformRotate * Math.PI / 180);
      const sin = Math.sin(transformRotate * Math.PI / 180);
      return (scaleX, scaleY) => {
        // 变换矩阵计算
        const a = cos * scaleX;
        const b = sin * scaleX;
        const c = -sin * scaleY;
        const d = cos * scaleY;
        const beforeTransformValueStr = is3DTransform
          ? `${a},${b},${transformValue[2]},${transformValue[3]},${c},${d}`
          : `${a},${b},${c},${d}`;

        return { transform: `${transformName}(${beforeTransformValueStr},${afterTransformValueStr})` };
      };
    }
    else {
      // 使用scale
      return (scaleX, scaleY) => ({ scale: getScale(scaleX, scaleY) });
    }
  }
}
