import type { DomRotateCustomRender, DomRotateOptions, DomRotateStyle } from '../types';
import { createDomStyleUpdateMethod } from '../../utils';

type SetStyleRotate = (value: number) => DomRotateStyle;

export class RotateStyleUpdater {
  private targetRef?: WeakRef<HTMLElement>;

  public setStyleRotate: SetStyleRotate = () => ({});

  constructor(private options: DomRotateOptions) {
    if (options.target) {
      this.targetRef = new WeakRef(options.target);
    }
    this.setStyleRotateUpdater();
  }

  /** 设置样式更新方法 */
  private setStyleRotateUpdater() {
    this.setStyleRotate = createDomStyleUpdateMethod<SetStyleRotate, DomRotateStyle>(
      value => ({ rotate: this.changeByCustomRender('rotate')(value) }),
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
}
