import crypto from 'node:crypto';
import { setTimeout } from 'node:timers/promises';

import { timer } from '../src';

describe('Timer Method Decorator Print Arguments', () => {
  let logSpy = jest.spyOn(global.console, 'log');
  beforeEach(() => {
    logSpy = jest.spyOn(global.console, 'log');
  });
  afterEach(() => {
    logSpy.mockRestore();
  });

  it('sec timer: when call method with arguments printing', async () => {
    class TestUsecase {
      @timer({ logArguments: true })
      async test(...args: unknown[]) {
        return setTimeout(250, args.length);
      }
    }

    const arg = crypto.randomBytes(10).toString('base64');

    await expect(new TestUsecase().test(arg)).resolves.toBe(1);
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(3);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      '[timer] [TestUsecase::test]: begin',
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      `[timer] [TestUsecase::test]: arg-0 ${arg}`,
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      3,
      expect.stringMatching(/\[timer\] \[TestUsecase::test\]: timer \d+\.\d+s/),
    );
  });

  it('sec timer: when call method with circular structure arguments printing', async () => {
    class TestUsecase {
      @timer({ logArguments: true })
      async test(...args: unknown[]) {
        return setTimeout(250, args.length);
      }
    }

    const arg: Record<string, any> = {};
    arg.arg = arg;
    arg.arg.arg = arg;
    arg.arg.arg2 = arg;
    arg.arg.arg3 = { arg };
    arg.arg2 = arg.arg.arg3;

    await expect(new TestUsecase().test(arg)).resolves.toBe(1);
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(3);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      '[timer] [TestUsecase::test]: begin',
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/Converting circular structure to JSON/),
    );
  });
});
