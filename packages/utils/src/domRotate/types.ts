/** 调整旋转配置项 */
export interface DomRotateOptions {
  /** 调整元素 */
  target?: HTMLDivElement
  /** 手动调整控制 */
  manual?: {
    /** 调整模式，默认为relative，relative: 相对当前角度调整，absolute: 调整到对应的角度 */
    mode?: 'relative' | 'absolute'
    /** 角度(仅支持deg单位) */
    rotate?: number | string
  }
  /** 指针控制事件 */
  pointer?: PointerEvent
  /** 自定义渲染 */
  customRender?: DomRotateCustomRender
  /** 关闭对target元素的更新，关闭后需通过callback方法手动给元素添加样式 */
  disableUpdate?: boolean
  /** 调整回调 */
  callback?: (content: DomRotateContent, style: DomRotateStyle) => void
  /** 指针活动开始 */
  onPointerBegin?: (content: DomRotateContent) => void
  /** 指针活动 */
  onPointerMove?: (content: DomRotateContent) => void
  /** 指针活动结束 */
  onPointerEnd?: (content: DomRotateContent) => void
}

/** 调整的样式 */
export interface DomRotateCustomRender {
  /** 旋转值 */
  rotate?: (value: number) => string
}

/** 旋转内容 */
export interface DomRotateContent {
  rotate?: number
}

/** 调整的样式 */
export interface DomRotateStyle {
  rotate?: string
}
