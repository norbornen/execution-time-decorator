import { sync_timer, async_timer, sync_hrtimer, async_hrtimer } from '../src';
import { promisify } from 'util';
import * as fs from 'fs';
import * as crypto from 'crypto';

class ExampleTimers {

    @sync_timer
    public readSync(filepath: string) {
        return fs.readFileSync(filepath);
    }

    @sync_timer
    public readSyncThrow(filepath: string) {
        return fs.readFileSync(filepath + 'a');
    }

    @async_timer
    public async readAsync(filepath: string) {
        return fs.promises.readFile(filepath);
    }

    @async_timer
    public async readAsyncThrow(filepath: string) {
        return fs.promises.readFile(filepath + 'a');
    }

    @sync_hrtimer
    public static readSync(filepath: string) {
        fs.readFileSync(filepath);
    }

    @async_hrtimer
    public static async readAsync(filepath: string) {
        return fs.promises.readFile(filepath);
    }

}

(async () => {

    const data = await promisify(crypto.randomBytes)(50 * 1024 * 1024);
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

})();

async function t(fn: () => any): Promise<void> {
    try {
        const res = fn();
        if (res instanceof Promise) {
            await res;
        }
    } catch (err) {
        // console.error((err as Error).message);
    }
}
