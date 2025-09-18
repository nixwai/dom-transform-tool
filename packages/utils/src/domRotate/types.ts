/** 调整的样式 */
export interface DomRotateStyle {
  rotate?: string
}

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
}
