import type { DomRotateOptions } from './types';
import { rotateByManual } from './manual-rotate';
import { rotateByPointer } from './pointer-rotate';
import { RotateApplication } from './rotate-core/rotate-application';

/**
 * 调节旋转角度函数
 * @param options 配置项 - {@link DomRotateOptions}
 * @return 释放函数，调用该函数释放指针事件
 */
export function domRotate(options?: DomRotateOptions) {
  const rotateApplication = new RotateApplication(options);

  rotateByManual(rotateApplication);
  return rotateByPointer(rotateApplication);
}

export * from './types';
