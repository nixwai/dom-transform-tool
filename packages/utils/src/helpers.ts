/** px 转 rem */
export function pxToRem(px: number) {
  return `${px / Number.parseFloat(getComputedStyle(document.documentElement).fontSize)}rem`;
};

/** px 转 vw */
export function pxToVw(px: number) {
  return `${px / window.innerWidth * 100}vw`;
};

/** px 转 vh */
export function pxToVh(px: number) {
  return `${px / window.innerHeight * 100}vh`;
};

/** px 转 宽度百分比 */
export function pxToWPct(px: number, { parentWidth }: { parentWidth: number }) {
  return `${px / parentWidth * 100}%`;
};

/** px 转 高度百分比 */
export function pxToHPct(px: number, { parentHeight }: { parentHeight: number }) {
  return `${px / parentHeight * 100}%`;
};
