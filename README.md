# execution-time-decorators
Measure of typescript method execution time 

## Adding to your project

### In Node.js

Call require to get the instance:
```js
const { sync_timer, async_timer } = require('execution-time-decorators');
```

Or in ES6 and TS:
```typescript
import { sync_timer, async_timer, sync_hrtimer, async_hrtimer } from 'execution-time-decorators';
```

## Usage
```typescript
class ExampleTimers {

    @sync_timer
    public readSync(filepath: string) {
        return fs.readFileSync(filepath);
    }

    @async_timer
    public async readAsync(filepath: string) {
        return fs.promises.readFile(filepath);
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
```

```console
[timer] [ExampleTimers::readSync]: begin
[timer] [ExampleTimers::readSync]: timer 0.027s
[timer] [ExampleTimers::readAsync]: begin
[timer] [ExampleTimers::readAsync]: timer 0.236s
[hrtimer] [static ExampleTimers::readSync]: begin
[hrtimer] [static ExampleTimers::readSync]: timer 28388315ns
[hrtimer] [static ExampleTimers::readAsync]: begin
[hrtimer] [static ExampleTimers::readAsync]: timer 177673866ns
```
