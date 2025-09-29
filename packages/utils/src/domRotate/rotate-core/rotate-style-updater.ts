import type { DomRotateCustomRender, DomRotateOptions, DomRotateStyle } from '../types';
import type { RotateDomAttrs } from './rotate-dom-attrs';
import { createDomStyleUpdateMethod } from '../../utils';

type SetStyleRotate = (value: number) => DomRotateStyle;

export class RotateStyleUpdater {
  private targetRef?: WeakRef<HTMLElement>;

  public setStyleRotate: SetStyleRotate = () => ({});

  constructor(private options: DomRotateOptions, private rotateDomAttrs: RotateDomAttrs) {
    if (options.target) {
      this.targetRef = new WeakRef(options.target);
    }
    this.setStyleRotateUpdater();
  }

  /** 设置样式更新方法 */
  private setStyleRotateUpdater() {
    this.setStyleRotate = createDomStyleUpdateMethod<SetStyleRotate, DomRotateStyle>(
      this.createRotateHandler(),
      this.targetRef,
      this.options.disableUpdate,
    );
  }

  /** 创建改变target元素的值方法 */
  private changeByCustomRender(key: keyof DomRotateCustomRender) {
    return (value: number) => {
      const customRender = this.options.customRender?.[key];
      const customValue = customRender?.(value);
      return customValue ?? `${value}deg`;
    };
  }

  /** 获取位移修改函数 */
  private createRotateHandler(): SetStyleRotate {
    const getRotate = this.changeByCustomRender('rotate');
    // 使用transform
    if (this.options.rotateType === 'transform') {
      const { transformName, transformValue, transformScaleX, transformScaleY } = this.rotateDomAttrs.variant;
      let afterTransformValueStr = '';
      const is3DTransform = transformValue.length > 6;
      if (is3DTransform) {
        // matrix3d(https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/matrix3d)
        afterTransformValueStr = `,${transformValue.slice(6).join(',')}`;
      }
      else {
        // matrix(https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function/matrix)
        afterTransformValueStr = `${transformValue.slice(4).join(',')}`;
      }
      // transform 不兼容customStyle自定义
      return (value) => {
        // 变换矩阵计算
        const cos = Math.cos(value * Math.PI / 180);
        const sin = Math.sin(value * Math.PI / 180);
        const a = cos * transformScaleX;
        const b = sin * transformScaleX;
        const c = -sin * transformScaleY;
        const d = cos * transformScaleY;
        const beforeTransformValueStr = is3DTransform
          ? `${a},${b},${transformValue[2]},${transformValue[3]},${c},${d}`
          : `${a},${b},${c},${d}`;
        return { transform: `${transformName}(${beforeTransformValueStr},${afterTransformValueStr})` };
      };
    }
    else {
      // 使用rotate
      return value => ({ rotate: getRotate(value) });
    }
  }
}
