/** DomRotate的配置项 */
export interface DomRotateOptions {
  /** 调整元素 */
  target?: HTMLElement
  /** 手动调整控制 */
  manual?: {
    /** 调整模式，默认为relative，relative: 相对当前角度调整，absolute: 调整到对应的角度 */
    mode?: 'relative' | 'absolute'
    /** 角度(仅支持deg单位) */
    rotate?: number | string
  }
  /** 指针的触发事件 */
  pointer?: PointerEvent
  /** 指针触发元素，不传则使用target */
  pointerTarget?: HTMLElement
  /** 使用rotate/transform进行旋转，默认使用rotate */
  rotateType?: DomRotateRotateType
  /** 固定每次改变的度数，单位deg，需大于0 */
  step?: number
  /** 自定义渲染 */
  customRender?: DomRotateCustomRender
  /** 自定义样式，用于兼容一些无法通过当前节点获取的样式 */
  customStyle?: DomRotateCustomStyle
  /** 关闭对target元素的更新，关闭后需通过callback方法手动给元素添加样式 */
  disableUpdate?: boolean
  /**
   * 关闭指针的默认结束事件
   * - 指针默认使用pointercancel、pointerup事件结束指针调整事件，关闭后则手动调用释放函数
   * - 释放函数在方法的返回值中（endPointerHandler = domResize()）
   */
  disablePointerEnd?: boolean
  /** 调整回调 */
  callback?: (content: DomRotateContent, style: DomRotateStyle) => void
  /** 指针活动开始 */
  onPointerBegin?: (content: DomRotateContent) => void
  /** 指针活动 */
  onPointerMove?: (content: DomRotateContent) => void
  /** 指针活动结束 */
  onPointerEnd?: (content: DomRotateContent) => void
}

export type DomRotateRotateType = 'rotate' | 'transform';

/** DomRotate的自定义渲染样式 */
export interface DomRotateCustomRender {
  /** 旋转值 */
  rotate?: (value: number) => string
}

/** DomRotate的内容 */
export interface DomRotateContent {
  rotate?: number
}

/** DomRotate的样式 */
export interface DomRotateStyle {
  rotate?: string
}

/** DomRotate的自定义样式，用于兼容一些无法通过当前节点获取的样式 */
export interface DomRotateCustomStyle {
  /** 旋转值(仅支持deg单位) */
  rotate?: number | string
  /** 最小旋转值[-180~180](仅支持deg单位) */
  minRotate?: number | string
  /** 最大旋转值[-180~180](仅支持deg单位) */
  maxRotate?: number | string
}
