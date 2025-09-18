/**
 * 根据传入的样式更新元素样式
 * @param targetRef 目标元素
 * @param styles 样式
 */
export function updateDomStyle<S>(targetRef: WeakRef<HTMLDivElement>, styles: S) {
  const target = targetRef.deref();
  if (!target) { return; } // 获取不到实例直接返回样式
  for (const key in styles) {
    (target.style as any)[key] = styles[key as keyof S]; // 直接修改元素样式
  }
}

/**
 * 创建改变元素样式方法
 * @param getStyleFn 获取样式方法
 * @param targetRef 目标元素
 * @param disableUpdate 是否关闭更新
 */
export function createDomStyleUpdateMethod<T extends (...params: any[]) => S, S>(
  getStyleFn: T,
  targetRef?: WeakRef<HTMLDivElement>,
  disableUpdate?: boolean,
): T {
  // 获取不到实例或者关闭更新下，不进行样式设置
  if (!targetRef || disableUpdate) {
    return getStyleFn;
  }
  // 给传入的target元素设置样式
  return ((...params) => {
    const styles = getStyleFn(...params);
    updateDomStyle(targetRef, styles);
    return styles;
  }) as T;
}
