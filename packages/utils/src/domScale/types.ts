/** DomScale的配置项 */
export interface DomScaleOptions {
  /** 调整元素 */
  target?: HTMLElement
  /** 调整方向, 不设置时默认为all */
  direction?: DomScaleDirection
  /** 手动调整控制 */
  manual?: {
    /** 调整模式，默认为relative，relative: 相对当前角度调整，absolute: 调整到对应的角度 */
    mode?: 'relative' | 'absolute'
    /** 缩放比例 */
    scale?: DomScaleValue
  }
  /** 使用scale/transform进行缩放，默认使用scale */
  scaleType?: DomScaleType
  /** 自定义渲染 */
  customRender?: DomScaleCustomRender
  /** 自定义样式，用于兼容一些无法通过当前节点获取的样式 */
  customStyle?: DomScaleCustomStyle
  /** 关闭对target元素的更新，关闭后需通过callback方法手动给元素添加样式 */
  disableUpdate?: boolean
  /** 调整回调 */
  callback?: (content: DomScaleContent, style: DomScaleStyle) => void
}

/** 缩放比例值（可用空格或数组区分横轴跟纵轴） */
export type DomScaleValue = number | string | number[] | string[];

/** DomScale的调整方向 */
export type DomScaleDirection = 'x' | 'y' | 'all';

/** 元素缩放时的样式类型 */
export type DomScaleType = 'scale' | 'transform';

/** DomScale的自定义渲染样式 */
export interface DomScaleCustomRender {
  /** 缩放值 */
  scale?: (scaleX: number, scaleY: number) => string
}

/** DomScale的内容 */
export interface DomScaleContent {
  scaleX?: number
  scaleY?: number
}

/** DomScale的样式 */
export interface DomScaleStyle {
  scale?: string
  transform?: string
}

/** DomScale的自定义样式，用于兼容一些无法通过当前节点获取的样式 */
export interface DomScaleCustomStyle {
  /** 缩放值 */
  scale?: DomScaleValue
  /** 最小缩放值 */
  minScale?: DomScaleValue
  /** 最大缩放值 */
  maxScale?: DomScaleValue
}
