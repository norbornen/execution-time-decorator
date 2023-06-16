import util from 'node:util';

export function isPromise<T = unknown>(p: T | Promise<T>): p is Promise<T> {
  if (util.types.isPromise(p)) {
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
