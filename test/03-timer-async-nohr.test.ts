import crypto from 'node:crypto';
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

  it('sec timer: when call correct async instace method', async () => {
    class TestUsecase {
      @timer()
      async test(filepath: string) {
        return fs.readFile(filepath);
      }
    }

    await expect(new TestUsecase().test(datafilePath)).resolves.toBeInstanceOf(
      Buffer,
    );
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
  });

  it('sec timer: when call async instace method which return an error', async () => {
    class TestUsecase {
      @timer()
      async test(filepath: string) {
        return fs.readFile(filepath + new Date().toISOString());
      }
    }

    await expect(new TestUsecase().test(datafilePath)).rejects.toThrowError(
      /ENOENT/,
    );
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
  });

  it('sec timer: when call correct async static method', async () => {
    class TestUsecase {
      @timer()
      static async test(filepath: string) {
        return fs.readFile(filepath);
      }
    }

    await expect(TestUsecase.test(datafilePath)).resolves.toBeInstanceOf(
      Buffer,
    );
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      '[timer] [static TestUsecase::test]: begin',
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(
        /\[timer\] \[static TestUsecase::test\]: timer \d+\.\d+s/,
      ),
    );
  });

  it('sec timer: when call async method which return an error', async () => {
    class TestUsecase {
      @timer()
      static async test(filepath: string) {
        return fs.readFile(filepath + new Date().toISOString());
      }
    }

    await expect(TestUsecase.test(datafilePath)).rejects.toThrowError(/ENOENT/);
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenNthCalledWith(
      1,
      '[timer] [static TestUsecase::test]: begin',
    );
    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(
        /\[timer\] \[static TestUsecase::test\]: timer \d+\.\d+s/,
      ),
    );
  });
});
