import type { DomResizeCustomStyleFn } from './types';

export const pxToRem: DomResizeCustomStyleFn = (px) => {
  return `${px / Number.parseFloat(getComputedStyle(document.documentElement).fontSize)}rem`;
};

export const pxToVw: DomResizeCustomStyleFn = (px) => {
  return `${px / window.innerWidth * 100}vw`;
};

export const pxToVh: DomResizeCustomStyleFn = (px) => {
  return `${px / window.innerHeight * 100}vh`;
};

export const pxToWPct: DomResizeCustomStyleFn = (px, { parentWidth }) => {
  return `${px / parentWidth * 100}%`;
};

export const pxToHPct: DomResizeCustomStyleFn = (px, { parentHeight }) => {
  return `${px / parentHeight * 100}%`;
};
