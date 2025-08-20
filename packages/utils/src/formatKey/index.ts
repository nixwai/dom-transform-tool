import { cloneDeep, get, set, unset } from 'lodash-es';

/**
 * Modify the keys of the target object and return a new object with custom keys
 * @param obj The object to be modified
 * @param paths An array where the first element is the old path and the second is the new path (if not provided, it indicates deletion)
 * @param defaultValue If the parsed value is undefined, it will be replaced by defaultValue
 * @returns A new object
 */
export function objectFormatKey<R extends object, T extends object>(obj: T, paths: (string | string[])[][], defaultValue?: any) {
  const newObj = cloneDeep(obj) as object;
  paths.forEach(([oldPath, newPath]) => {
    if (newPath) {
      const value = get(newObj, oldPath, defaultValue);
      set(newObj, newPath, value);
    }
  });
  // 删除旧key数据
  paths.forEach(([oldPath]) => {
    unset(newObj, oldPath);
  });
  return newObj as R;
};
