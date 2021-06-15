import { sync_timer, async_timer, sync_hrtimer, async_hrtimer } from '../src';
import { promisify } from 'util';
import * as fs from 'fs';
import * as crypto from 'crypto';

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

(async () => {
  const data = await promisify(crypto.randomBytes)(50 * 1024 * 1024);
  const filepath = `${__dirname}/example.data`;
  await fs.promises.writeFile(filepath, data);

  let t0 = new Date().valueOf();
  await promisify(fs.readFile)(filepath);
  console.log(`read promisify(fs.readFile) ${(new Date().valueOf() - t0) * 0.001}`);
  t0 = new Date().valueOf();
  await fs.promises.readFile(filepath);
  console.log(`read fs.promises.readFile ${(new Date().valueOf() - t0) * 0.001}`);
  console.log('=====================================================');

  const example = new ExampleTimers();
  await t(() => example.readSync(filepath));
  await t(() => example.readSyncThrow(filepath));
  await t(() => example.readAsync(filepath));
  await t(() => example.readAsyncThrow(filepath));
  await t(() => ExampleTimers.readSync(filepath));
  await t(() => ExampleTimers.readAsync(filepath));

  await fs.promises.unlink(filepath);
})();

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
