/** DomDrag的配置项 */
export interface DomDragOptions {
  /** 拖动元素 */
  target?: HTMLElement
  /** 拖动方向 */
  direction?: DomDragDirection
  /** 手动拖动控制 */
  manual?: {
    /** 调整模式，默认为relative，relative: 相对当前位置拖动，absolute: 拖动到对应的位置 */
    mode?: 'relative' | 'absolute'
    /** 横轴偏移(仅支持px/百分比) */
    offsetX?: number | string
    /** 纵轴偏移(仅支持px/百分比) */
    offsetY?: number | string
  }
  /** 指针的触发事件 */
  pointer?: PointerEvent
  /** 指针操作的触发元素，默认使用target */
  pointerTarget?: HTMLElement
  /**
   * 使用position/translate/transform进行偏移，默认使用translate
   * - 推荐使用position、translate，transform无法与CSS的rotate、scale同时使用
   * - https://developer.mozilla.org/zh-CN/docs/Web/CSS/rotate
   * - https://developer.mozilla.org/zh-CN/docs/Web/CSS/scale
   */
  offsetType?: DomDragOffsetType
  /** 网格对齐，固定每次拖动的最小距离，默认[0.5,0.5]，单位px，使用小数注意精度问题，建议使用0.5的倍数 */
  grid?: number[]
  /** 自定义渲染 */
  customRender?: DomDragCustomRender
  /** 自定义样式，用于兼容一些无法通过当前节点获取的样式 */
  customStyle?: DomDragCustomStyle
  /** 关闭对target元素的更新，关闭后需通过callback方法手动给元素添加样式 */
  disableUpdate?: boolean
  /**
   * 关闭指针的默认结束事件
   * - 指针默认使用pointercancel、pointerup事件结束指针调整事件，关闭后则手动调用释放函数
   * - 释放函数在方法的返回值中（endPointerHandler = domDrag()）
   */
  disablePointerEnd?: boolean
  /** 拖动回调 */
  callback?: (content: DomDragContent, style: DomDragStyle) => void
  /** 指针活动开始 */
  onPointerBegin?: (content: DomDragContent) => void
  /** 指针活动 */
  onPointerMove?: (content: DomDragContent) => void
  /** 指针活动结束 */
  onPointerEnd?: (content: DomDragContent) => void
}

/** 拖动方向 */
export type DomDragDirection = 'x' | 'y' | 'all';

/** 拖动的偏移类型 */
export type DomDragOffsetType = 'position' | 'transform' | 'translate';

/** 拖动的自定义渲染样式 */
export interface DomDragCustomRender {
  /** 横轴偏移，无法在offset为transform时使用 */
  offsetX?: DomDragCustomRenderMethod
  /** 纵轴偏移，无法在offset为transform时使用 */
  offsetY?: DomDragCustomRenderMethod
}

/** 拖动的自定义渲染样式的方法 */
export type DomDragCustomRenderMethod = (
  value: number,
  options: {
    parentWidth: number
    parentHeight: number
  }
) => string;

/** 拖动的自定义样式，用于兼容一些无法通过当前节点获取的样式 */
export interface DomDragCustomStyle {
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
}

/** DomDrag的内容，单位px */
export interface DomDragContent {
  offsetX?: number
  offsetY?: number
}

/** DomDrag的样式 */
export interface DomDragStyle {
  transform?: string
  translate?: string
  top?: string
  left?: string
}
