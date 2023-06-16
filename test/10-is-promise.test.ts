import { isPromise } from '../src/utils';

describe('Is Promise', () => {
  it('sec timer: when call correct sync instace method', async () => {
    const noop = () => {
      /**/
    };
    expect(isPromise(Promise.resolve(1))).toEqual(true);
    expect(isPromise(Promise.reject(1).catch(noop))).toEqual(true);
    expect(isPromise({ then: noop, catch: noop })).toEqual(true);
    expect(isPromise(await Promise.resolve(1))).toEqual(false);
    expect(isPromise(5)).toEqual(false);
  });
});
