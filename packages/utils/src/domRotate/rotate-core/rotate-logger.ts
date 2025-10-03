import type { RotateParams } from './rotate-params';

export class RotateLogger {
  /** 调整后的值 */
  value: number = 0;
  /** 总共调整的角度 */
  total: number = 0;
  /** 每次调整的角度 */
  angle: number = 0;

  constructor(private rotateParams: RotateParams) {
    this.value = this.rotateParams.originValue;
  }

  /** 记录每次的调整 */
  public logAngle(value: number) {
    this.angle = value - this.value; // 减去上次的角度，获取调整角度
    this.total = value - this.rotateParams.originValue; // 总共调整的角度
    this.value = value;
  };
}
