import type { DomResizeOptions } from '../types';
import type { DomAttrs } from './dom-attrs';
import type { Axis } from './index';

type GetOffsetFn = (distance: number, axis: Axis, dir: 1 | -1, value: number) => { offsetCurrentAxis: number, offsetAnotherAxis: number };

type OffsetFn = (dis: number, axis: Axis, dir: 1 | -1) => { offsetCurrentAxis: number, offsetAnotherAxis: number };

/** 创建获取偏移值函数 */
function createResizingOffset(
  createFn: () => (dis: number, axis: Axis, dir: 1 | -1) => { getOffsetPositive: OffsetFn, getOffsetNegative: OffsetFn },
): GetOffsetFn {
  const offsetFns = createFn();
  return (dis, axis, dir, value) => {
    const { getOffsetNegative, getOffsetPositive } = offsetFns(dis, axis, dir);
    // value大于0时使用正向偏移值，小于0时使用负向偏移值
    return value > 0 ? getOffsetPositive(dis, axis, dir) : getOffsetNegative(dis, axis, dir);
  };
}

/** 零偏移 */
const zeroOffset: OffsetFn = () => {
  return { offsetCurrentAxis: 0, offsetAnotherAxis: 0 };
};

export function movingOffset(options: DomResizeOptions, domAttrs: DomAttrs) {
  if (!options.offset) {
    // 不需要偏移时使用空位移函数，减少不必要的计算
    return { getForwardMoveOffset: zeroOffset, getBackwardMoveOffset: zeroOffset, getBothMoveOffset: zeroOffset };
  }
  const { width, height, offsetX, offsetY, transform, minWidth, minHeight } = domAttrs;
  const { rotate, originRelativeX, originRelativeY, scaleX, scaleY } = transform;
  const rad = rotate * Math.PI / 180;
  const cosRad = Math.cos(rad);
  const sinRad = Math.sin(rad);
  /** 缩放增值 */
  const scaleAxisMultiple = {
    x: {
      v1: (scaleX - 1) * originRelativeX,
      v2: (scaleX - 1) * (1 - originRelativeX),
    },
    y: {
      v1: (scaleY - 1) * originRelativeY,
      v2: (scaleY - 1) * (1 - originRelativeY),
    },
  };
  /** 旋转当前轴增值 */
  const rotateCurrentAxisMultiple = {
    x: {
      v1: scaleX * (cosRad - 1) * originRelativeX,
      v2: scaleX * (cosRad - 1) * (1 - originRelativeX),
    },
    y: {
      v1: scaleY * (cosRad - 1) * originRelativeY,
      v2: scaleY * (cosRad - 1) * (1 - originRelativeY),
    },
  };
  /** 旋转另一轴增值 */
  const rotateAnotherAxisMultiple = {
    x: {
      v1: scaleX * sinRad * originRelativeX,
      v2: scaleX * sinRad * (1 - originRelativeX),
    },
    y: {
      v1: scaleY * sinRad * originRelativeY,
      v2: scaleY * sinRad * (1 - originRelativeY),
    },
  };
  /** 越轴改变时，需要调整的偏移值 */
  const negativeAxiosOffset = options.crossAxis
    ? {
        x: {
          originCos: offsetX + width + width * (scaleX * cosRad - 1) * (1 - 2 * originRelativeX),
          minCos: minWidth * scaleX * cosRad,
          originSin: width * (scaleX * sinRad) * (1 - 2 * originRelativeX),
          minSin: minWidth * scaleX * sinRad,
        },
        y: {
          originCos: offsetY + height + height * (scaleY * cosRad - 1) * (1 - 2 * originRelativeY),
          minCos: minHeight * scaleY * cosRad,
          originSin: height * (scaleY * sinRad) * (1 - 2 * originRelativeY),
          minSin: minHeight * scaleY * sinRad,
        },
      }
    : { x: { originCos: 0, minCos: 0, originSin: 0, minSin: 0 }, y: { originCos: 0, minCos: 0, originSin: 0, minSin: 0 } };
  /** 原始位移 */
  const originAxiosOffset = {
    x: offsetX,
    y: offsetY,
  };

  /** 获取向前调整的位移 */
  const getForwardMoveOffset = createResizingOffset(() => {
    const getOffsetPositive: OffsetFn = (distance, axis) => {
      const scalePositiveOffset = distance * scaleAxisMultiple[axis].v1;
      const rotateCurrentPositiveOffset = distance * rotateCurrentAxisMultiple[axis].v1;
      const rotateAnotherPositiveOffset = distance * rotateAnotherAxisMultiple[axis].v1;
      return {
        offsetCurrentAxis: originAxiosOffset[axis] + scalePositiveOffset + rotateCurrentPositiveOffset,
        offsetAnotherAxis: rotateAnotherPositiveOffset,
      };
    };
    let getOffsetNegative = zeroOffset;
    if (options.crossAxis) {
      const otherCurrentNegativeValue = {
        x: negativeAxiosOffset.x.originCos + negativeAxiosOffset.x.minCos,
        y: negativeAxiosOffset.y.originCos + negativeAxiosOffset.y.minCos,
      };
      const otherAnotherNegativeValue = {
        x: negativeAxiosOffset.x.originSin + negativeAxiosOffset.x.minSin,
        y: negativeAxiosOffset.y.originSin + negativeAxiosOffset.y.minSin,
      };
      getOffsetNegative = (distance, axis) => {
        const scaleNegativeOffset = distance * scaleAxisMultiple[axis].v2;
        const rotateCurrentNegativeOffset = distance * rotateCurrentAxisMultiple[axis].v2;
        const rotateAnotherNegativeOffset = distance * rotateAnotherAxisMultiple[axis].v2;
        return {
          offsetCurrentAxis: otherCurrentNegativeValue[axis] + distance + scaleNegativeOffset + rotateCurrentNegativeOffset,
          offsetAnotherAxis: otherAnotherNegativeValue[axis] + rotateAnotherNegativeOffset,
        };
      };
    }
    return () => ({
      getOffsetPositive,
      getOffsetNegative,
    });
  });

  /** 获取向后调整的位移 */
  const getBackwardMoveOffset = createResizingOffset(() => {
    const getOffsetPositive: OffsetFn = (distance, axis) => {
      const scalePositiveOffset = distance * scaleAxisMultiple[axis].v2;
      const rotateCurrentPositiveOffset = distance * rotateCurrentAxisMultiple[axis].v2;
      const rotateAnotherPositiveOffset = distance * rotateAnotherAxisMultiple[axis].v2;
      return {
        offsetCurrentAxis: originAxiosOffset[axis] + distance + scalePositiveOffset + rotateCurrentPositiveOffset,
        offsetAnotherAxis: rotateAnotherPositiveOffset,
      };
    };
    let getOffsetNegative = zeroOffset;
    if (options.crossAxis) {
      const otherCurrentNegativeValue = {
        x: negativeAxiosOffset.x.originCos - negativeAxiosOffset.x.minCos,
        y: negativeAxiosOffset.y.originCos - negativeAxiosOffset.y.minCos,
      };
      const otherAnotherNegativeValue = {
        x: negativeAxiosOffset.x.originSin - negativeAxiosOffset.x.minSin,
        y: negativeAxiosOffset.y.originSin - negativeAxiosOffset.y.minSin,
      };
      getOffsetNegative = (distance, axis) => {
        const scaleNegativeOffset = distance * scaleAxisMultiple[axis].v1;
        const rotateCurrentNegativeOffset = distance * rotateCurrentAxisMultiple[axis].v1;
        const rotateAnotherNegativeOffset = distance * rotateAnotherAxisMultiple[axis].v1;
        return {
          offsetCurrentAxis: otherCurrentNegativeValue[axis] + scaleNegativeOffset + rotateCurrentNegativeOffset,
          offsetAnotherAxis: otherAnotherNegativeValue[axis] + rotateAnotherNegativeOffset,
        };
      };
    }
    return () => ({
      getOffsetPositive,
      getOffsetNegative,
    });
  });

  /** 获取前后调整的位移 */
  const getBothMoveOffset = createResizingOffset(() => {
    const scaleMultiple = {
      x: (scaleX - 1) * (originRelativeX - 0.5),
      y: (scaleY - 1) * (originRelativeY - 0.5),
    };
    const rotateCurrentBothMultiple = {
      x: scaleX * (cosRad - 1) * (originRelativeX - 0.5),
      y: scaleY * (cosRad - 1) * (originRelativeY - 0.5),
    };
    const rotateAnotherBothMultiple = {
      x: scaleX * sinRad * (originRelativeX - 0.5),
      y: scaleY * sinRad * (originRelativeY - 0.5),
    };
    const otherCurrentNegativeValue = options.crossAxis
      ? {
          x: offsetX + width - 2 * width * (scaleX * cosRad - 1) * (originRelativeX - 0.5),
          y: offsetY + height - 2 * height * (scaleY * cosRad - 1) * (originRelativeY - 0.5),
        }
      : { x: 0, y: 0 };
    const otherAnotherNegativeValue = options.crossAxis
      ? {
          x: -2 * width * (scaleX * sinRad) * (originRelativeX - 0.5),
          y: -2 * height * (scaleY * sinRad) * (originRelativeY - 0.5),
        }
      : { x: 0, y: 0 };
    return (distance, axis, dir) => {
      const distanceHalf = dir * distance / 2;
      const scaleOffset = dir * distance * scaleMultiple[axis];
      const rotateCurrentBothOffset = dir * distance * rotateCurrentBothMultiple[axis];
      const rotateAnotherBothOffset = dir * distance * rotateAnotherBothMultiple[axis];
      const distanceCurrentOffset = scaleOffset + rotateCurrentBothOffset - distanceHalf;
      const distanceAnotherOffset = rotateAnotherBothOffset;
      return {
        getOffsetPositive: () => ({
          offsetCurrentAxis: originAxiosOffset[axis] + distanceCurrentOffset,
          offsetAnotherAxis: distanceAnotherOffset,
        }),
        getOffsetNegative: () => ({
          offsetCurrentAxis: otherCurrentNegativeValue[axis] - distanceCurrentOffset,
          offsetAnotherAxis: otherAnotherNegativeValue[axis] - distanceAnotherOffset,
        }),
      };
    };
  });

  return {
    getForwardMoveOffset,
    getBackwardMoveOffset,
    getBothMoveOffset,
  };
}
