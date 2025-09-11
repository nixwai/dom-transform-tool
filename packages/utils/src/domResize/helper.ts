import type { DomResizeCustomRenderMethod } from './types';

export const pxToRem: DomResizeCustomRenderMethod = (px) => {
  return `${px / Number.parseFloat(getComputedStyle(document.documentElement).fontSize)}rem`;
};

export const pxToVw: DomResizeCustomRenderMethod = (px) => {
  return `${px / window.innerWidth * 100}vw`;
};

export const pxToVh: DomResizeCustomRenderMethod = (px) => {
  return `${px / window.innerHeight * 100}vh`;
};

export const pxToWPct: DomResizeCustomRenderMethod = (px, { parentWidth }) => {
  return `${px / parentWidth * 100}%`;
};

export const pxToHPct: DomResizeCustomRenderMethod = (px, { parentHeight }) => {
  return `${px / parentHeight * 100}%`;
};
