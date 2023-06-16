import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import pino from 'pino';

import { timer } from '../src';

describe('Timer Method Decorator Pino logger', () => {
  const datafilePath = `${__dirname}/${path.basename(__filename)}.data`;
  beforeAll(async () => {
    const data = crypto.randomBytes(50 * 1024 * 1024);
    await fs.writeFile(datafilePath, data).catch(console.error);
  });
  afterAll(async () => {
    await fs.unlink(datafilePath).catch(console.error);
  });

  it('sec timer: when call correct sync instace method', async () => {
    const logs = new Array<string>();
    const logger = pino({}, { write: (data: string) => logs.push(data) });

    class TestUsecase {
      @timer({ logger })
      test(filepath: string) {
        return readFileSync(filepath);
      }
    }

    expect(new TestUsecase().test(datafilePath)).toBeInstanceOf(Buffer);
    expect(logs).toHaveLength(2);
    expect(() => JSON.parse(logs.at(0)!)).not.toThrowError();
    expect(JSON.parse(logs.at(0)!).msg).toMatch(
      /\[timer\] \[TestUsecase::test\]: begin/,
    );
    expect(() => JSON.parse(logs.at(1)!)).not.toThrowError();
    expect(JSON.parse(logs.at(1)!).msg).toMatch(
      /\[timer\] \[TestUsecase::test\]: timer \d+\.\d+s/,
    );
  });
});
