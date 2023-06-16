import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import { setTimeout } from 'node:timers/promises';

import { timer } from '../src';

class ExampleTimers {
  @timer()
  readSync(filepath: string) {
    return fs.readFileSync(filepath);
  }

  @timer()
  readSyncThrow(filepath: string) {
    return fs.readFileSync(filepath + 'a');
  }

  @timer({ logArguments: true })
  async readAsync(filepath: string) {
    return fs.promises.readFile(filepath);
  }

  @timer()
  async readAsyncThrow(filepath: string) {
    return fs.promises.readFile(filepath + 'a');
  }

  @timer({ logArguments: true })
  async doSomething1(_first = BigInt(1), ..._args: unknown[]) {
    return setTimeout(250, 1);
  }

  @timer({ logArguments: true })
  async doSomething2(..._args: unknown[]) {
    return setTimeout(250, 1);
  }

  @timer({ hr: true })
  static readSync(filepath: string) {
    return fs.readFileSync(filepath);
  }

  @timer({ hr: true })
  static async readAsync(filepath: string) {
    return fs.promises.readFile(filepath);
  }
}

async function t(fn: () => PromiseLike<any> | any): Promise<void> {
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
  await t(() => example.doSomething1(BigInt(123), process.env, []));
  await t(async () => {
    const arg: Record<string, any> = {};
    arg.arg = arg;
    arg.arg.arg = arg;
    arg.arg.arg2 = arg;
    arg.arg.arg3 = { arg };
    arg.arg2 = arg.arg.arg3;
    await example.doSomething2(arg);
  });

  await fs.promises.unlink(filepath);

  return void 1;
}
