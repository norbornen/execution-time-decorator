import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import { timer } from '../src';

describe('Timer Method Decorator Routine', () => {
  let logSpy = jest.spyOn(global.console, 'log');
  const datafilePath = `${__dirname}/${path.basename(__filename)}.data`;
  beforeAll(async () => {
    const data = crypto.randomBytes(50 * 1024 * 1024);
    await fs.writeFile(datafilePath, data).catch(console.error);
  });
  afterAll(async () => {
    await fs.unlink(datafilePath).catch(console.error);
  });
  beforeEach(() => {
    logSpy = jest.spyOn(global.console, 'log');
  });
  afterEach(() => {
    logSpy.mockRestore();
  });

  it('nano timer: when call correct sync instace method', async () => {
    class TestUsecase {
      @timer({ hr: true })
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
  });

  it('nano timer: when call sync instace method which return an error', async () => {
    class TestUsecase {
      @timer({ hr: true })
      test(filepath: string) {
        return readFileSync(filepath + new Date().toISOString());
      }
    }

    expect(() => new TestUsecase().test(datafilePath)).toThrowError(/ENOENT/);
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
  });

  it('nano timer: when call correct sync static method', async () => {
    class TestUsecase {
      @timer({ hr: true })
      static test(filepath: string) {
        return readFileSync(filepath);
      }
    }

    expect(TestUsecase.test(datafilePath)).toBeInstanceOf(Buffer);
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      '[timer] [static TestUsecase::test]: begin',
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(
        /\[timer\] \[static TestUsecase::test\]: timer \d+ns/,
      ),
    );
  });

  it('nano timer: when call sync method which return an error', async () => {
    class TestUsecase {
      @timer({ hr: true })
      static test(filepath: string) {
        return readFileSync(filepath + new Date().toISOString());
      }
    }

    expect(() => TestUsecase.test(datafilePath)).toThrowError(/ENOENT/);
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      '[timer] [static TestUsecase::test]: begin',
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(
        /\[timer\] \[static TestUsecase::test\]: timer \d+ns/,
      ),
    );
  });
});
