export function isPromise<T = unknown>(p: T | Promise<T>): p is Promise<T> {
  if (p instanceof Promise) {
    return true;
  }
  if (
    p !== null &&
    typeof p === 'object' &&
    'then' in p &&
    typeof p.then === 'function' &&
    'catch' in p &&
    typeof p.catch === 'function'
  ) {
    return true;
  }
  return false;
}
