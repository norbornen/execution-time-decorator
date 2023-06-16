import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import { timer } from '../src';

describe('Timer Method Decorator Custom logger', () => {
  const datafilePath = `${__dirname}/${path.basename(__filename)}.data`;
  beforeAll(async () => {
    const data = crypto.randomBytes(50 * 1024 * 1024);
    await fs.writeFile(datafilePath, data).catch(console.error);
  });
  afterAll(async () => {
    await fs.unlink(datafilePath).catch(console.error);
  });

  it('sec timer: when call correct sync instace method', async () => {
    const logger = getLogger();
    const logSpy = jest.spyOn(logger, 'log');

    class TestUsecase {
      @timer({ logger })
      test(filepath: string) {
        return readFileSync(filepath);
      }
    }

    expect(new TestUsecase().test(datafilePath)).toBeInstanceOf(Buffer);
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      '[timer] [TestUsecase::test]: begin',
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/\[timer\] \[TestUsecase::test\]: timer \d+\.\d+s/),
    );

    logSpy.mockRestore();
  });

  it('nano timer: when call correct sync instace method', async () => {
    const logger = getLogger();
    const logSpy = jest.spyOn(logger, 'log');

    class TestUsecase {
      @timer({ logger: logger, hr: true })
      test(filepath: string) {
        return readFileSync(filepath);
      }
    }

    expect(new TestUsecase().test(datafilePath)).toBeInstanceOf(Buffer);
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      '[timer] [TestUsecase::test]: begin',
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/\[timer\] \[TestUsecase::test\]: timer \d+ns/),
    );

    logSpy.mockRestore();
  });
});

function getLogger() {
  return {
    info(...args: unknown[]) {
      console.info(...this.format(args));
    },
    log(...args: unknown[]) {
      console.log(...this.format(args));
    },
    format: (args: unknown[]) => {
      args.unshift(`[LOGGER]`);
      return args;
    },
  };
}
