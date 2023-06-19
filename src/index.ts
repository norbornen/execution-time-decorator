import { Logger, PerfLogger } from './perf-logger';
import { isPromise } from './utils';

/**
 * @example
 * "@timer({ logger: pino, logArguments: true, hr: false })"
 */
export function timer({
  logger,
  logArguments = false,
  hr = false,
}: {
  /**
   * @default {false}
   */
  logArguments?: boolean;
  /**
   * Your current logger if it needed
   * @default {console}
   */
  logger?: Logger;
  /**
   * Print time as nanoseconds
   * @default {false}
   */
  hr?: boolean;
} = {}) {
  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    propertyDescriptor =
      propertyDescriptor ||
      Object.getOwnPropertyDescriptor(target, propertyKey);

    const scopename =
      (target instanceof Function
        ? `static ${target.name}`
        : target.constructor.name) + `::${propertyKey}`;

    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = function (...args: unknown[]) {
      const l = new PerfLogger(scopename, undefined, hr, logger);
      if (logArguments) {
        l.printArguments(...args);
      }
      try {
        const result = originalMethod.apply(this, args);
        if (isPromise(result)) {
          return result.finally(() => l.end());
        } else {
          l.end();
          return result;
        }
      } catch (err) {
        l.end();
        throw err;
      }
    };

    return propertyDescriptor;
  };
}

let legacyBehaviourTimer: ReturnType<typeof timer>;
let legacyBehaviourHrTimer: ReturnType<typeof timer>;

/** @deprecated 'Use \@timer() instread \@sync_timer' decorator */
export function sync_timer(
  target: any,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor,
) {
  legacyBehaviourTimer ||= timer();
  return legacyBehaviourTimer(target, propertyKey, propertyDescriptor);
}

/** @deprecated 'Use \@timer() instread \@async_timer' decorator */
export function async_timer(
  target: any,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor,
) {
  legacyBehaviourTimer ||= timer();
  return legacyBehaviourTimer(target, propertyKey, propertyDescriptor);
}

/** @deprecated 'Use \@timer() instread \@sync_hrtimer' decorator */
export function sync_hrtimer(
  target: any,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor,
) {
  legacyBehaviourHrTimer ||= timer({ hr: true });
  return legacyBehaviourHrTimer(target, propertyKey, propertyDescriptor);
}

/** @deprecated 'Use \@timer() instread \@async_hrtimer' decorator */
export function async_hrtimer(
  target: any,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor,
) {
  legacyBehaviourHrTimer ||= timer({ hr: true });
  return legacyBehaviourHrTimer(target, propertyKey, propertyDescriptor);
}
