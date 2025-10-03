import type { DomScaleOptions } from './types';
import { scaleByManual } from './manual-scale';
import { ScaleApplication } from './scale-core/scale-application';

/**
 * 调节缩放比例
 * @param options 配置项 - {@link DomScaleOptions}
 */
export function domScale(options?: DomScaleOptions) {
  const rotateApplication = new ScaleApplication(options);

  scaleByManual(rotateApplication);
}

export * from './types';
