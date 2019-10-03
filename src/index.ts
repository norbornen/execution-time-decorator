// method decorator @sync_timer
export function sync_timer(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
    if (propertyDescriptor === undefined) {
        propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    }
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = function(...args: any[]) {
        const t0 = new Date().valueOf();
        console.log(`[timer] [${target.constructor.name}::${propertyKey}]: begin`);
        const result = originalMethod.apply(this, args);
        console.log(`[timer] [${target.constructor.name}::${propertyKey}]: timer ${((new Date().valueOf() - t0) * 0.001).toFixed(3)}s`);
        return result;
    };
    return propertyDescriptor;
}

// method decorator @async_timer
export function async_timer(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
    if (propertyDescriptor === undefined) {
        propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    }
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function(...args: any[]) {
        const t0 = new Date().valueOf();
        console.log(`[timer] [${target.constructor.name}::${propertyKey}]: begin`);
        try {
            const result = await originalMethod.apply(this, args);
            console.log(`[timer] [${target.constructor.name}::${propertyKey}]: timer ${((new Date().valueOf() - t0) * 0.001).toFixed(3)}s`);
            return result;
        } catch (err) {
            console.log(`[timer] [${target.constructor.name}::${propertyKey}]: timer ${((new Date().valueOf() - t0) * 0.001).toFixed(3)}s`);
            throw err;
        }
    };
    return propertyDescriptor;
}
