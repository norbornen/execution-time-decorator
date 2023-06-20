import { isNode, isPrimitiveOrDate } from './utils';

export type Logger =
  | {
      log: (...args: any[]) => void;
    }
  | {
      info: (...args: any[]) => void;
    };

const isInNode = isNode();

export class PerfLogger {
  private static readonly nano = Math.pow(10, -9);
  private readonly timerStart = isInNode
    ? process.hrtime.bigint()
    : BigInt(new Date().getTime());
  private timerEnd: bigint | undefined;

  constructor(
    private readonly scopename?: string,
    private readonly name: string = 'timer',
    private readonly hr?: boolean,
    private readonly logger?: Logger,
  ) {
    /* istanbul ignore next */
    if (!isInNode) {
      this.hr = false;
    }
    this.printLine('begin');
  }

  private get timerDiff() {
    return this.timerEnd ? this.timerEnd - this.timerStart : null;
  }

  end() {
    this.timerEnd = isInNode
      ? process.hrtime.bigint()
      : BigInt(new Date().getTime());
    try {
      this.printLine('timer');
    } catch (err) {
      this.printError(err);
    }
  }

  printArguments(...args: unknown[]) {
    args.forEach((x, idx) => {
      try {
        this.printLine(
          `arg-${idx} ${isPrimitiveOrDate(x) ? x : JSON.stringify(x, null, 2)}`,
        );
      } catch (err) {
        this.printError(err);
      }
    });
  }

  private printLine(stagename?: string) {
    const parts: string[] = [];
    if (this.name) {
      parts.push(`[${this.name}]`);
    }
    if (this.scopename) {
      parts.push(`[${this.scopename}]:`);
    }
    if (stagename) {
      parts.push(`${stagename}`);
    }
    if (this.timerEnd) {
      if (this.hr === true) {
        parts.push(`${this.timerDiff}ns`);
      } else {
        const nn = Number(this.timerDiff);
        const exp = Math.ceil(Math.log10(nn));
        const n = nn * PerfLogger.nano;
        parts.push(`${n.toFixed(Math.max(10 - exp, 3))}s`);
      }
    }
    if (parts.length > 0) {
      this.print(parts.join(' '));
    }
  }

  private printError(err: unknown) {
    this.print(err instanceof Error ? err.message : (err as any));
  }

  private print(aString: string) {
    const l = this.logger || console;
    if ('log' in l && l.log) {
      l.log(aString);
    } else if ('info' in l && l.info) {
      l.info(aString);
    }
  }
}
