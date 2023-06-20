# execution-time-decorators

The `timer()` decorator starts a timer you can use to track how long an operation takes.
Suitable for use in both synchronous and asynchronous methods both in Node.js and Browser apps.

![build](https://img.shields.io/github/actions/workflow/status/norbornen/execution-time-decorator/unit-test.yml) [![cov](https://norbornen.github.io/execution-time-decorator/badges/coverage.svg)](https://github.com/norbornen/execution-time-decorator/actions)
[![codeql](https://github.com/norbornen/execution-time-decorator/actions/workflows/codeql.yml/badge.svg)](https://github.com/norbornen/execution-time-decorator/actions) ![dependencies](https://img.shields.io/badge/dependencies-0-success) [![Known Vulnerabilities](https://snyk.io/test/github/norbornen/execution-time-decorator/badge.svg)](https://snyk.io/test/github/norbornen/execution-time-decorator) [![npm](https://img.shields.io/npm/v/execution-time-decorators)](https://www.npmjs.com/package/execution-time-decorators) ![minified](https://img.shields.io/bundlephobia/min/execution-time-decorators)

## Adding to your project

### In Node.js

Call require to get the instance:
```js
const { timer } = require('execution-time-decorators');
```

Or in ES6 and TS:
```typescript
import { timer } from 'execution-time-decorators';
```

## Usage
```typescript
class ExampleTimers {

    @timer()
    readSync(filepath: string) {
        return fs.readFileSync(filepath);
    }

    @timer()
    async readAsync(filepath: string) {
        return fs.promises.readFile(filepath);
    }

    @timer({ logger: pino })
    async readAsyncP(filepath: string) {
        return fs.promises.readFile(filepath);
    }

    @timer({ hr: true })
    static readSync(filepath: string) {
        return fs.readFileSync(filepath);
    }

    @timer({ logger: pino, hr: true })
    static async readAsync(filepath: string) {
        return fs.promises.readFile(filepath);
    }

}
```

```console
[timer] [ExampleTimers::readSync]: begin
[timer] [ExampleTimers::readSync]: timer 0.008s

[timer] [ExampleTimers::readAsync]: begin
[timer] [ExampleTimers::readAsync]: timer 0.010s

{"level":30,"time":1687023007188,"pid":56981,"hostname":"192.168.68.52","msg":"[timer] [ExampleTimers::readAsyncP]: begin"}
{"level":30,"time":1687023007205,"pid":56981,"hostname":"192.168.68.52","msg":"[timer] [ExampleTimers::readAsyncP]: timer 0.017s"}

[timer] [static ExampleTimers::readSync]: begin
[timer] [static ExampleTimers::readSync]: timer 7212041ns

{"level":30,"time":1687023007212,"pid":56981,"hostname":"192.168.68.52","msg":"[timer] [static ExampleTimers::readAsync]: begin"}
{"level":30,"time":1687023007231,"pid":56981,"hostname":"192.168.68.52","msg":"[timer] [static ExampleTimers::readAsync]: timer 18302917ns"}
```

## Options

Type: `object`

### logger

Type: `{ log: (...args: any[]) => void } | { info: (...args: any[]) => void }`\
Default: `console`

Default or your current logger.

### logArguments

Type: `boolean`\
Default: `false`

When true, arguments passed to the method will be print to the logs.

### hr

Type: `boolean`\
Default: `false`

Print execution time in nanoseconds.
