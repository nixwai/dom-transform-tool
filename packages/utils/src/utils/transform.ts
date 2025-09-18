/** 转换为数字 */
export function toNum(value?: string) {
  if (!value) { return 0; }
  return Number.parseFloat(value) || 0;
}

/** 获取百分比值 */
export function getPctValue(value: string, parentValue: number) {
  return value.includes('%') ? parentValue * toNum(value) / 100 : toNum(value);
}
