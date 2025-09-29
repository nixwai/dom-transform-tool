import type { Axis } from '../../typing';
import type { DomResizeOptions } from '../types';
import type { ResizeDomAttrs } from './resize-dom-attrs';

type GetOffsetFn = (distance: number, axis: Axis, dir: 1 | -1, value: number) => { offsetCurrentAxis: number, offsetAnotherAxis: number };
type OffsetFn = (dis: number, axis: Axis, dir: 1 | -1) => { offsetCurrentAxis: number, offsetAnotherAxis: number };

/** 创建获取偏移值函数 */
function createResizingOffset(
  createFn: () => (dis: number, axis: Axis, dir: 1 | -1) => { getOffsetPositive: OffsetFn, getOffsetNegative: OffsetFn },
): GetOffsetFn {
  const offsetFns = createFn();
  return (dis, axis, dir, value) => {
    // 通过传入的createFn创建获取偏移值的函数
    const { getOffsetNegative, getOffsetPositive } = offsetFns(dis, axis, dir);
    // value大于0时使用正向偏移值，小于0时使用负向偏移值
    return value > 0 ? getOffsetPositive(dis, axis, dir) : getOffsetNegative(dis, axis, dir);
  };
}

/** 零偏移 */
const zeroOffset: OffsetFn = () => {
  return { offsetCurrentAxis: 0, offsetAnotherAxis: 0 };
};

export class ResizeOffsetCounter {
  private cosRad = 0;
  private sinRad = 0;
  /** 原始位移 */
  private axiosOffsetKey = { x: 'offsetX', y: 'offsetY' } as const;
  /** 缩放增值 */
  private scaleAxisMultiple = {
    x: { v1: 0, v2: 0 },
    y: { v1: 0, v2: 0 },
  };

  /** 旋转当前轴增值 */
  private rotateCurrentAxisMultiple = {
    x: { v1: 0, v2: 0 },
    y: { v1: 0, v2: 0 },
  };

  /** 旋转另一轴增值 */
  private rotateAnotherAxisMultiple = {
    x: { v1: 0, v2: 0 },
    y: { v1: 0, v2: 0 },
  };

  /** 越轴时需要调整的偏移值 */
  private negativeAxiosOffset = {
    x: { originCos: 0, minCos: 0, originSin: 0, minSin: 0 },
    y: { originCos: 0, minCos: 0, originSin: 0, minSin: 0 },
  };

  /** 获取向前调整的位移 */
  public getForwardOffset: GetOffsetFn = zeroOffset;
  /** 获取向后调整的位移 */
  public getBackwardOffset: GetOffsetFn = zeroOffset;
  /** 获取前后调整的位移 */
  public getBothOffset: GetOffsetFn = zeroOffset;

  constructor(private options: DomResizeOptions, private resizeDomAttrs: ResizeDomAttrs) {
    if (!this.options.offsetType) { return; }
    this.setVariantParams();
    this.setOffsetParams();
    this.setOffsetFunctions();
  }

  /** 更新变换参数 */
  private setVariantParams() {
    const { rotate, transformOriginX, transformOriginY, scaleX, scaleY } = this.resizeDomAttrs.variant;
    const rad = rotate * Math.PI / 180;
    this.cosRad = Math.cos(rad);
    this.sinRad = Math.sin(rad);

    this.scaleAxisMultiple = {
      x: {
        v1: (scaleX - 1) * transformOriginX,
        v2: (scaleX - 1) * (1 - transformOriginX),
      },
      y: {
        v1: (scaleY - 1) * transformOriginY,
        v2: (scaleY - 1) * (1 - transformOriginY),
      },
    };
    this.rotateCurrentAxisMultiple = {
      x: {
        v1: scaleX * (this.cosRad - 1) * transformOriginX,
        v2: scaleX * (this.cosRad - 1) * (1 - transformOriginX),
      },
      y: {
        v1: scaleY * (this.cosRad - 1) * transformOriginY,
        v2: scaleY * (this.cosRad - 1) * (1 - transformOriginY),
      },
    };
    this.rotateAnotherAxisMultiple = {
      x: {
        v1: scaleX * this.sinRad * transformOriginX,
        v2: scaleX * this.sinRad * (1 - transformOriginX),
      },
      y: {
        v1: scaleY * this.sinRad * transformOriginY,
        v2: scaleY * this.sinRad * (1 - transformOriginY),
      },
    };
  }

  /** 更新位移参数 */
  private setOffsetParams() {
    const { offsetX, offsetY } = this.resizeDomAttrs;
    const { width, height, minWidth, minHeight } = this.resizeDomAttrs.size;
    const { transformOriginX, transformOriginY, scaleX, scaleY } = this.resizeDomAttrs.variant;
    // 越轴改变时，才需要计算调整的偏移值
    if (this.options.crossAxis) {
      this.negativeAxiosOffset = {
        x: {
          originCos: offsetX + width + width * (scaleX * this.cosRad - 1) * (1 - 2 * transformOriginX),
          minCos: minWidth * scaleX * this.cosRad,
          originSin: width * (scaleX * this.sinRad) * (1 - 2 * transformOriginX),
          minSin: minWidth * scaleX * this.sinRad,
        },
        y: {
          originCos: offsetY + height + height * (scaleY * this.cosRad - 1) * (1 - 2 * transformOriginY),
          minCos: minHeight * scaleY * this.cosRad,
          originSin: height * (scaleY * this.sinRad) * (1 - 2 * transformOriginY),
          minSin: minHeight * scaleY * this.sinRad,
        },
      };
    }
    else {
      this.negativeAxiosOffset = {
        x: { originCos: 0, minCos: 0, originSin: 0, minSin: 0 },
        y: { originCos: 0, minCos: 0, originSin: 0, minSin: 0 },
      };
    }
  }

  /** 获取移动偏移函数 */
  private setOffsetFunctions() {
    // 获取向前调整的位移
    this.getForwardOffset = createResizingOffset(() => {
      const getOffsetPositive: OffsetFn = (distance, axis) => {
        const scalePositiveOffset = distance * this.scaleAxisMultiple[axis].v1;
        const rotateCurrentPositiveOffset = distance * this.rotateCurrentAxisMultiple[axis].v1;
        const rotateAnotherPositiveOffset = distance * this.rotateAnotherAxisMultiple[axis].v1;
        return {
          offsetCurrentAxis: this.resizeDomAttrs[this.axiosOffsetKey[axis]] + scalePositiveOffset + rotateCurrentPositiveOffset,
          offsetAnotherAxis: rotateAnotherPositiveOffset,
        };
      };
      let getOffsetNegative = zeroOffset;
      if (this.options.crossAxis) {
        const otherCurrentNegativeValue = {
          x: this.negativeAxiosOffset.x.originCos + this.negativeAxiosOffset.x.minCos,
          y: this.negativeAxiosOffset.y.originCos + this.negativeAxiosOffset.y.minCos,
        };
        const otherAnotherNegativeValue = {
          x: this.negativeAxiosOffset.x.originSin + this.negativeAxiosOffset.x.minSin,
          y: this.negativeAxiosOffset.y.originSin + this.negativeAxiosOffset.y.minSin,
        };
        getOffsetNegative = (distance, axis) => {
          const scaleNegativeOffset = distance * this.scaleAxisMultiple[axis].v2;
          const rotateCurrentNegativeOffset = distance * this.rotateCurrentAxisMultiple[axis].v2;
          const rotateAnotherNegativeOffset = distance * this.rotateAnotherAxisMultiple[axis].v2;
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
    this.getBackwardOffset = createResizingOffset(() => {
      const getOffsetPositive: OffsetFn = (distance, axis) => {
        const scalePositiveOffset = distance * this.scaleAxisMultiple[axis].v2;
        const rotateCurrentPositiveOffset = distance * this.rotateCurrentAxisMultiple[axis].v2;
        const rotateAnotherPositiveOffset = distance * this.rotateAnotherAxisMultiple[axis].v2;
        return {
          offsetCurrentAxis: this.resizeDomAttrs[this.axiosOffsetKey[axis]] + distance + scalePositiveOffset + rotateCurrentPositiveOffset,
          offsetAnotherAxis: rotateAnotherPositiveOffset,
        };
      };
      let getOffsetNegative = zeroOffset;
      if (this.options.crossAxis) {
        const otherCurrentNegativeValue = {
          x: this.negativeAxiosOffset.x.originCos - this.negativeAxiosOffset.x.minCos,
          y: this.negativeAxiosOffset.y.originCos - this.negativeAxiosOffset.y.minCos,
        };
        const otherAnotherNegativeValue = {
          x: this.negativeAxiosOffset.x.originSin - this.negativeAxiosOffset.x.minSin,
          y: this.negativeAxiosOffset.y.originSin - this.negativeAxiosOffset.y.minSin,
        };
        getOffsetNegative = (distance, axis) => {
          const scaleNegativeOffset = distance * this.scaleAxisMultiple[axis].v1;
          const rotateCurrentNegativeOffset = distance * this.rotateCurrentAxisMultiple[axis].v1;
          const rotateAnotherNegativeOffset = distance * this.rotateAnotherAxisMultiple[axis].v1;
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
    this.getBothOffset = createResizingOffset(() => {
      const { offsetX, offsetY } = this.resizeDomAttrs;
      const { width, height } = this.resizeDomAttrs.size;
      const { transformOriginX, rotate, transformOriginY, scaleX, scaleY } = this.resizeDomAttrs.variant;
      const rad = rotate * Math.PI / 180;
      const cosRad = Math.cos(rad);
      const sinRad = Math.sin(rad);
      const scaleMultiple = {
        x: (scaleX - 1) * (transformOriginX - 0.5),
        y: (scaleY - 1) * (transformOriginY - 0.5),
      };
      const rotateCurrentBothMultiple = {
        x: scaleX * (cosRad - 1) * (transformOriginX - 0.5),
        y: scaleY * (cosRad - 1) * (transformOriginY - 0.5),
      };
      const rotateAnotherBothMultiple = {
        x: scaleX * sinRad * (transformOriginX - 0.5),
        y: scaleY * sinRad * (transformOriginY - 0.5),
      };
      const otherCurrentNegativeValue = this.options.crossAxis
        ? {
            x: offsetX + width - 2 * width * (scaleX * cosRad - 1) * (transformOriginX - 0.5),
            y: offsetY + height - 2 * height * (scaleY * cosRad - 1) * (transformOriginY - 0.5),
          }
        : { x: 0, y: 0 };
      const otherAnotherNegativeValue = this.options.crossAxis
        ? {
            x: -2 * width * (scaleX * sinRad) * (transformOriginX - 0.5),
            y: -2 * height * (scaleY * sinRad) * (transformOriginY - 0.5),
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
            offsetCurrentAxis: this.resizeDomAttrs[this.axiosOffsetKey[axis]] + distanceCurrentOffset,
            offsetAnotherAxis: distanceAnotherOffset,
          }),
          getOffsetNegative: () => ({
            offsetCurrentAxis: otherCurrentNegativeValue[axis] - distanceCurrentOffset,
            offsetAnotherAxis: otherAnotherNegativeValue[axis] - distanceAnotherOffset,
          }),
        };
      };
    });
  }
}
