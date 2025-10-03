/** 转换为数字 */
export function toNum(value?: string) {
  if (!value) { return 0; }
  return Number.parseFloat(value) || 0;
}

/** 获取百分比值 */
export function getPctValue(value: string, parentValue: number) {
  return value.includes('%') ? parentValue * toNum(value) / 100 : toNum(value);
}

/** 精度处理函数 */
export function getPrecisionValue(value: number): number {
  return Math.round(value * 10000) / 10000;
}

/** 由单个或多个值转化为固定两个数据 */
export function getDoubleValue(value: number | string | number[] | string[]) {
  const scaleStr = Array.isArray(value) ? value.join(' ') : String(value);
  const scaleArr = scaleStr.split(' ').map(toNum);
  return [scaleArr[0], scaleArr[1] ?? scaleArr[0]];
}
