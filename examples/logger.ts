import * as crypto from 'node:crypto';
import * as fs from 'node:fs';

import pino from 'pino';

import { timer } from '../src';

const logger1 = new Proxy(console, {
  get(target, ...rest) {
    const value = Reflect.get(target, ...rest);
    return typeof value === 'function'
      ? (...args: unknown[]) => {
          const LOG_PREFIX =
            new Date().getDate() +
            '.' +
            new Date().getMonth() +
            '.' +
            new Date().getFullYear();
          return value.call(target, LOG_PREFIX, ...args);
        }
      : value;
  },
});

const logger2 = pino();

const logger3 = {
  info(...args: unknown[]) {
    console.info(...this.format(args));
  },
  log(...args: unknown[]) {
    console.log(...this.format(args));
  },
  format: (args: unknown[]) => {
    args.unshift(`[${new Date().toISOString()}]`);
    return args;
  },
};

class ExampleTimers {
  @timer({ logger: logger1 })
  readSync(filepath: string) {
    return fs.readFileSync(filepath);
  }

  @timer({ logger: logger1 })
  readSyncThrow(filepath: string) {
    return fs.readFileSync(filepath + 'a');
  }

  @timer({ logger: logger2 })
  async readAsync(filepath: string) {
    return fs.promises.readFile(filepath);
  }

  @timer({ logger: logger2 })
  async readAsyncThrow(filepath: string) {
    return fs.promises.readFile(filepath + 'a');
  }

  @timer({ logger: logger3, hr: true })
  static readSync(filepath: string) {
    return fs.readFileSync(filepath);
  }

  @timer({ logger: logger3, hr: true })
  static async readAsync(filepath: string) {
    return fs.promises.readFile(filepath);
  }
}

async function t(fn: () => PromiseLike<Buffer> | Buffer): Promise<void> {
  try {
    const res = fn();
    if (res instanceof Promise) {
      await res;
    }
  } catch (err) {
    // console.error((err as Error).message);
  }
}

export async function check() {
  const data = crypto.randomBytes(50 * 1024 * 1024);
  const filepath = `${__dirname}/example.data`;
  await fs.promises.writeFile(filepath, data);

  const example = new ExampleTimers();
  await t(() => example.readSync(filepath));
  await t(() => example.readSyncThrow(filepath));
  await t(() => example.readAsync(filepath));
  await t(() => example.readAsyncThrow(filepath));
  await t(() => ExampleTimers.readSync(filepath));
  await t(() => ExampleTimers.readAsync(filepath));

  await fs.promises.unlink(filepath);

  return void 1;
}
