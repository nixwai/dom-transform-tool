/** DomResize的配置项 */
export interface DomResizeOptions {
  /** 调整元素 */
  target?: HTMLElement
  /** 调整方向 */
  direction?: DomResizeDirection
  /** 手动调整控制 */
  manual?: {
    /** 调整模式，默认为relative，relative: 相对当前尺寸调整，absolute: 调整到对应的尺寸 */
    mode?: 'relative' | 'absolute'
    /** 宽度(仅支持px/百分比) */
    width?: number | string
    /** 高度(仅支持px/百分比) */
    height?: number | string
  }
  /** 指针控制事件 */
  pointer?: PointerEvent
  /** 指针操作的触发元素，默认使用target */
  pointerTarget?: HTMLElement
  /**
   * 使用position/translate/transform进行偏移
   * - 推荐使用position、translate，transform无法与CSS的rotate、scale同时使用
   * - https://developer.mozilla.org/zh-CN/docs/Web/CSS/rotate
   * - https://developer.mozilla.org/zh-CN/docs/Web/CSS/scale
   */
  offsetType?: DomResizeOffsetType
  /** 是否可跨轴调整，需要配置offset才生效 */
  crossAxis?: boolean
  /** 网格对齐，固定每次调整的最小距离，默认[0.5,0.5]，单位px，使用小数注意精度问题，建议使用0.5的倍数 */
  grid?: number[]
  /** 锁定宽高比例，direction需要包含纵轴与横轴的方向，锁定后grid的配置也会根据当前元素比例发生改变 */
  lockAspectRatio?: boolean
  /** 自定义渲染 */
  customRender?: DomResizeCustomRender
  /** 自定义样式，用于兼容一些无法通过当前节点获取的样式 */
  customStyle?: DomResizeCustomStyle
  /** 关闭对target元素的更新，关闭后需通过callback方法手动给元素添加样式 */
  disableUpdate?: boolean
  /**
   * 关闭指针的默认结束事件
   * - 指针默认使用pointercancel、pointerup事件结束指针调整事件，关闭后则手动调用释放函数
   * - 释放函数在方法的返回值中（endPointerHandler = domResize()）
   */
  disablePointerEnd?: boolean
  /** 调整回调 */
  callback?: (content: DomResizeContent, style: DomResizeStyle) => void
  /** 指针活动开始 */
  onPointerBegin?: (content: DomResizeContent) => void
  /** 指针活动 */
  onPointerMove?: (content: DomResizeContent) => void
  /** 指针活动结束 */
  onPointerEnd?: (content: DomResizeContent) => void
}

/** 四个方向同时调整 */
type AllDirection = 'all';

/** 单独调整一个方向 */
type SingleDirection = 'left' | 'right' | 'top' | 'bottom';

/** 两个方向同时调整 */
type TwoDirection = 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom' | 'left-right' | 'top-bottom';

/** 三个方向同时调整 */
type ThreeDirection = 'left-top-right' | 'left-bottom-right' | 'top-left-bottom' | 'top-right-bottom';

/** DomResize的调整方向 */
export type DomResizeDirection = AllDirection | SingleDirection | TwoDirection | ThreeDirection;

/** DomResize的调整偏移的类型 */
export type DomResizeOffsetType = 'position' | 'transform' | 'translate';

/** DomResize的自定义渲染样式 */
export interface DomResizeCustomRender {
  /** 宽度 */
  width?: DomResizeCustomRenderMethod
  /** 高度 */
  height?: DomResizeCustomRenderMethod
  /** 横轴的偏移，无法在offset为transform时使用 */
  offsetX?: DomResizeCustomRenderMethod
  /** 纵轴的偏移，无法在offset为transform时使用 */
  offsetY?: DomResizeCustomRenderMethod
}

/** DomResize的自定义渲染样式的方法 */
export type DomResizeCustomRenderMethod = (
  value: number,
  options: {
    parentWidth: number
    parentHeight: number
  }
) => string;

/** DomResize的自定义样式，用于兼容一些无法通过当前节点获取的样式 */
export interface DomResizeCustomStyle {
  /**
   * transform的变化原点，使用数组可以分别指定横轴和纵轴，默认根据内联样式决定
   * - https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-origin
   * - 当前功能仅会识别target的内联样式transform-origin类型，其他情况需要通过配置，确保不会有异常的偏移
   */
  transformOrigin?: string | string[]
  /** 旋转度数(仅支持deg单位) */
  rotate?: number | string
  /** 缩放值，使用数组可以分别指定横轴和纵轴 */
  scale?: number | string | (number | string)[]
  /** 横轴位移(仅支持px/百分比) */
  offsetX?: number | string
  /** 纵轴位移(仅支持px/百分比) */
  offsetY?: number | string
  /** 宽度(仅支持px/百分比) */
  width?: number | string
  /** 高度(仅支持px/百分比) */
  height?: number | string
  /** 父级宽度(仅支持px) */
  parentWidth?: number
  /** 父级高度(仅支持px) */
  parentHeight?: number
  /** 最大宽度(仅支持px/百分比) */
  maxWidth?: number | string
  /** 最大高度(仅支持px/百分比) */
  maxHeight?: number | string
  /** 最小宽度(仅支持px/百分比) */
  minWidth?: number | string
  /** 最小高度(仅支持px/百分比) */
  minHeight?: number | string
}

/** DomResize的内容，单位px */
export interface DomResizeContent {
  width?: number
  height?: number
  offsetX?: number
  offsetY?: number
};

/** DomResize的样式 */
export interface DomResizeStyle {
  width?: string
  height?: string
  transform?: string
  translate?: string
  top?: string
  left?: string
}
