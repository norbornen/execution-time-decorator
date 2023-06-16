import * as crypto from 'node:crypto';
import * as fs from 'node:fs';

import { async_hrtimer, async_timer, sync_hrtimer, sync_timer } from '../src';

class ExampleTimers {
  @sync_timer
  readSync(filepath: string) {
    return fs.readFileSync(filepath);
  }

  @sync_timer
  readSyncThrow(filepath: string) {
    return fs.readFileSync(filepath + 'a');
  }

  @async_timer
  async readAsync(filepath: string) {
    return fs.promises.readFile(filepath);
  }

  @async_timer
  async readAsyncThrow(filepath: string) {
    return fs.promises.readFile(filepath + 'a');
  }

  @sync_hrtimer
  static readSync(filepath: string) {
    return fs.readFileSync(filepath);
  }

  @async_hrtimer
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
