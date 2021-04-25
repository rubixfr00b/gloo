export function isWritable<T extends Object>(obj: T, key: keyof T) {
  const desc = Object.getOwnPropertyDescriptor(obj, key) || {}
  return Boolean(desc.writable)
}