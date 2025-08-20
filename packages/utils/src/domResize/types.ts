/** 调整方向 */
export type DomResizeDirection =
  | 'all'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'left-top'
  | 'left-bottom'
  | 'right-top'
  | 'right-bottom'
  | 'left-right'
  | 'top-bottom'
  | 'left-top-right'
  | 'left-bottom-right'
  | 'top-left-bottom'
  | 'top-right-bottom';

/** 调整的内容 */
export interface DomResizeContent {
  width?: number
  height?: number
  offsetX?: number
  offsetY?: number
};

/** 调整的样式 */
export interface DomResizeStyle {
  width?: string
  height?: string
  transform?: string
  translate?: string
  top?: string
  left?: string
}

/** 调整偏移的类型 */
export type DomResizeOffsetType = 'position' | 'transform' | 'translate';

/** 调整大小配置项 */
export interface DomResizeOptions {
  /** 调整元素 */
  target?: HTMLDivElement
  /** 调整方向 */
  direction?: DomResizeDirection
  /** 指针控制事件 */
  event?: PointerEvent
  /** 手动控制水平移动距离 */
  distanceX?: number
  /** 手动控制垂直移动距离 */
  distanceY?: number
  /** 使用transform/position/translate进行偏移 */
  offset?: DomResizeOffsetType
  /**
   * transform-origin的是否为绝对定位（非百分比或offset-keyword），使用数组可以分别指定横轴和纵轴，默认根据内联样式决定
   * @see https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-origin
   * 由于函数仅会识别内联样式设置的transform-origin类型，其他情况需要通过主要设置判断是否为绝对定位，确保不会有异常的偏移
   */
  originIsAbsolute?: boolean | (boolean | undefined)[]
  /** 是否可跨轴调整，需要配置offset才生效 */
  crossAxis?: boolean
  /** 网格对齐，固定每次调整的最小距离，默认[0.5,0.5]，单位px，使用小数注意精度问题，建议使用0.5的倍数 */
  grid?: number[]
  /** 锁定宽高比例，锁定后grid的配置也会根据当前元素比例发生改变 */
  lockAspectRatio?: boolean
  /** 自定义控制，启用后不会执行默认的调整逻辑，需通过callback方法手动给元素添加样式 */
  customControl?: boolean
  /** 调整回调 */
  callback?: (content: DomResizeContent, style: DomResizeStyle) => void
}
