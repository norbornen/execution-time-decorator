export function sync_timer(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
    if (propertyDescriptor === undefined) {
        propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
    }
    const timername = (target instanceof Function ? `static ${target.name}` : target.constructor.name) + `::${propertyKey}`;
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = function(...args: any[]) {
        const t0 = new Date().valueOf();
        console.log(`[timer] [${timername}]: begin`);
        try {
            const result = originalMethod.apply(this, args);
            console.log(`[timer] [${timername}]: timer ${((new Date().valueOf() - t0) * 0.001).toFixed(3)}s`);
            return result;
        } catch (err) {
            console.log(`[timer] [${timername}]: timer ${((new Date().valueOf() - t0) * 0.001).toFixed(3)}s`);
            throw err;
        }
    };
    return propertyDescriptor;
}

export function async_timer(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
    if (propertyDescriptor === undefined) {
        propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
    }
    const timername = (target instanceof Function ? `static ${target.name}` : target.constructor.name) + `::${propertyKey}`;
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function(...args: any[]) {
        const t0 = new Date().valueOf();
        console.log(`[timer] [${timername}]: begin`);
        try {
            const result = await originalMethod.apply(this, args);
            console.log(`[timer] [${timername}]: timer ${((new Date().valueOf() - t0) * 0.001).toFixed(3)}s`);
            return result;
        } catch (err) {
            console.log(`[timer] [${timername}]: timer ${((new Date().valueOf() - t0) * 0.001).toFixed(3)}s`);
            throw err;
        }
    };
    return propertyDescriptor;
}

export function sync_hrtimer(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
    if (propertyDescriptor === undefined) {
        propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
    }
    const timername = (target instanceof Function ? `static ${target.name}` : target.constructor.name) + `::${propertyKey}`;
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = function(...args: any[]) {
        const t0 = process.hrtime.bigint();
        console.log(`[hrtimer] [${timername}]: begin`);
        try {
            const result = originalMethod.apply(this, args);
            console.log(`[hrtimer] [${timername}]: timer ${(process.hrtime.bigint() - t0)}ns`);
            return result;
        } catch (err) {
            console.log(`[hrtimer] [${timername}]: timer ${(process.hrtime.bigint() - t0)}ns`);
            throw err;
        }
    };
    return propertyDescriptor;
}

export function async_hrtimer(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
    if (propertyDescriptor === undefined) {
        propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
    }
    const timername = (target instanceof Function ? `static ${target.name}` : target.constructor.name) + `::${propertyKey}`;
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function(...args: any[]) {
        const t0 = process.hrtime.bigint();
        console.log(`[hrtimer] [${timername}]: begin`);
        try {
            const result = await originalMethod.apply(this, args);
            console.log(`[hrtimer] [${timername}]: timer ${(process.hrtime.bigint() - t0)}ns`);
            return result;
        } catch (err) {
            console.log(`[hrtimer] [${timername}]: timer ${(process.hrtime.bigint() - t0)}ns`);
            throw err;
        }
    };
    return propertyDescriptor;
}
