import type { DomResizeOptions } from '../types';
import type { Dir, DomAttrs } from './dom-attrs';
import type { Axis, ResizingFn } from './index';
import { movingOffset } from './moving-offset';

interface DirectionParams {
  /** 原始值 */
  originValue: number
  /** 原始位置 */
  originOffset: number
  /** 最小值 */
  minValue: number
  /** 最大调整距离 */
  maxDistance: number
  /** 最小调整距离 */
  minDistance: number
  /** 网格的移动距离 */
  gridDistance: number
}

const DEFAULT_GRID = 0.5;

/** 调整距离 */
export interface ResizeDistance {
  /** 横轴距离 */
  x: number
  /** 纵轴距离 */
  y: number
  /** 横轴方向 */
  dirX: 1 | -1 | 0
  /** 纵轴方向 */
  dirY: 1 | -1 | 0
}

export function createResizingFns(options: DomResizeOptions, domAttrs: DomAttrs) {
  const { width, height, aspectRatio, offsetX, offsetY, maxWidth, minWidth, maxHeight, minHeight } = domAttrs;

  const direction = options.direction || 'all';
  const hasLeft = direction.includes('left');
  const hasRight = direction.includes('right');
  const hasTop = direction.includes('top');
  const hasBottom = direction.includes('bottom');
  /** 记录每次的位移距离 */
  const moveDistance: ResizeDistance = {
    x: 0,
    y: 0,
    dirX: hasLeft === hasRight ? 0 : (hasRight ? 1 : -1),
    dirY: hasTop === hasBottom ? 0 : (hasBottom ? 1 : -1),
  };
  /** 上一次的位移距离 */
  const lastDistance: Pick<ResizeDistance, 'x' | 'y'> = { x: width, y: height };
  // 记录移动距离
  const logDistance = (value: number, axis: Axis) => {
    moveDistance[axis] = value - lastDistance[axis];
    lastDistance[axis] = value;
  };

  // 固定的移动距离，两边都移动时需要*2
  let gridX = (options.grid?.[0] || DEFAULT_GRID) * (moveDistance.dirX ? 1 : 2);
  let gridY = (options.grid?.[1] || DEFAULT_GRID) * (moveDistance.dirY ? 1 : 2);
  if (options.lockAspectRatio) {
    // 锁定宽高比时，固定的移动距离也会变化
    if (options.event || options.distanceX) {
      gridY = gridX / aspectRatio;
    }
    else {
      gridX = gridY * aspectRatio;
    }
  }

  /** 元素的纵横轴参数 */
  const domAxisParams: { x: DirectionParams, y: DirectionParams } = {
    x: {
      originValue: width,
      originOffset: offsetX,
      minValue: width - Math.floor((width - minWidth) / gridX) * gridX,
      maxDistance: Math.floor((maxWidth - width) / gridX) * gridX,
      minDistance: Math.ceil((minWidth - width) / gridX) * gridX,
      gridDistance: gridX,
    },
    y: {
      originValue: height,
      originOffset: offsetY,
      minValue: height - Math.floor((height - minHeight) / gridY) * gridY,
      maxDistance: Math.floor((maxHeight - height) / gridY) * gridY,
      minDistance: Math.ceil((minHeight - height) / gridY) * gridY,
      gridDistance: gridY,
    },
  };

  /** 获取移动距离 */
  let getMoveDistance: (startLocation: number, endLocation: number, axis: Axis, dir: Dir) => number;
  if (options.crossAxis) {
    const minCrossDis = {
      x: 2 * domAxisParams.x.minValue,
      y: 2 * domAxisParams.y.minValue,
    };
    const maxCrossDis = {
      x: Math.floor((maxWidth + width) / gridX) * gridX,
      y: Math.floor((maxWidth + height) / gridY) * gridY,
    };
    getMoveDistance = (startLocation: number, endLocation: number, axis: Axis, dir: Dir) => {
      const { maxDistance, minDistance, gridDistance } = domAxisParams[axis];
      const distance = Math.round((endLocation - startLocation) / gridDistance) * gridDistance;
      const dis = distance * dir;
      if (dis < minDistance) {
        let targetDis = distance - dir * minCrossDis[axis];
        if (-dir * targetDis > maxCrossDis[axis]) {
          targetDis = -dir * maxCrossDis[axis];
        }
        return targetDis;
      }
      if (dis > maxDistance) { return maxDistance * dir; }
      return distance;
    };
  }
  else {
    getMoveDistance = (startLocation: number, endLocation: number, axis: Axis, dir: Dir) => {
      const { maxDistance, minDistance, gridDistance } = domAxisParams[axis];
      const distance = Math.round((endLocation - startLocation) / gridDistance) * gridDistance;
      const dis = distance * dir;
      if (dis < minDistance) { return minDistance * dir; }
      if (dis > maxDistance) { return maxDistance * dir; }
      return distance;
    };
  }

  const { getForwardMoveOffset, getBackwardMoveOffset, getBothMoveOffset } = movingOffset(options, domAttrs);

  const getMoveValue = options.offset
    ? (value: number) => Math.abs(value)
    : (value: number, minValue: number) => value > minValue ? value : minValue;

  /** 向前调整（往右或者往下）长度与位移 */
  const resizingForward: ResizingFn = (startLocation, endLocation, axis) => {
    const { originValue, minValue } = domAxisParams[axis];
    const distance = getMoveDistance(startLocation, endLocation, axis, 1);
    const value = originValue + distance;
    const { offsetCurrentAxis, offsetAnotherAxis } = getForwardMoveOffset(distance, axis, 1, value);
    const resizeValue = getMoveValue(value, minValue);
    logDistance(resizeValue, axis);
    return {
      value: resizeValue,
      offset: offsetCurrentAxis,
      otherOffset: offsetAnotherAxis,
    };
  };
  /** 向后调整（往左或者往上）长度与位移 */
  const resizingBackward: ResizingFn = (startLocation, endLocation, axis) => {
    const { originValue, minValue } = domAxisParams[axis];
    const distance = getMoveDistance(startLocation, endLocation, axis, -1);
    const value = originValue - distance;
    const { offsetCurrentAxis, offsetAnotherAxis } = getBackwardMoveOffset(distance, axis, -1, value);
    const resizeValue = getMoveValue(value, minValue);
    logDistance(resizeValue, axis);
    return {
      value: resizeValue,
      offset: offsetCurrentAxis,
      otherOffset: offsetAnotherAxis,
    };
  };
  /** 前后一起调整(上下或者左右)长度与位移 */
  const resizingBoth: ResizingFn = (startLocation, endLocation, axis, pointerDir = 1) => {
    const { originValue, minValue } = domAxisParams[axis];
    // 两边一起调整时需要对数据翻倍
    const distance = getMoveDistance(2 * startLocation, 2 * endLocation, axis, pointerDir);
    const value = originValue + pointerDir * distance;
    const { offsetCurrentAxis, offsetAnotherAxis } = getBothMoveOffset(distance, axis, pointerDir, value);
    const resizeValue = getMoveValue(value, minValue);
    logDistance(resizeValue, axis);
    return {
      value: resizeValue,
      offset: offsetCurrentAxis,
      otherOffset: offsetAnotherAxis,
    };
  };

  return { moveDistance, resizingForward, resizingBackward, resizingBoth };
}
