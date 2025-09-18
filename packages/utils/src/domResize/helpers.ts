import type { DomResizeCustomRenderMethod } from './types';

/** px 转 rem */
export const pxToRem: DomResizeCustomRenderMethod = (px) => {
  return `${px / Number.parseFloat(getComputedStyle(document.documentElement).fontSize)}rem`;
};

/** px 转 vw */
export const pxToVw: DomResizeCustomRenderMethod = (px) => {
  return `${px / window.innerWidth * 100}vw`;
};

/** px 转 vh */
export const pxToVh: DomResizeCustomRenderMethod = (px) => {
  return `${px / window.innerHeight * 100}vh`;
};

/** px 转 宽度百分比 */
export const pxToWPct: DomResizeCustomRenderMethod = (px, { parentWidth }) => {
  return `${px / parentWidth * 100}%`;
};

/** px 转 高度百分比 */
export const pxToHPct: DomResizeCustomRenderMethod = (px, { parentHeight }) => {
  return `${px / parentHeight * 100}%`;
};
