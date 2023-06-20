/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PerfLogger } from '../src/perf-logger';

describe('PerfLogger Test', () => {
  let logSpy = jest.spyOn(global.console, 'log');
  beforeEach(() => {
    logSpy = jest.spyOn(global.console, 'log');
  });
  afterEach(() => {
    logSpy.mockRestore();
  });

  it('Catch exception when "end" called', async () => {
    const l = new PerfLogger();
    // @ts-ignore
    l['timerStart'] = 1;
    l.end();

    expect(logSpy).toHaveBeenNthCalledWith(
      2,
      'Cannot mix BigInt and other types, use explicit conversions',
    );
  });
});
