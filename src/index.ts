// method decorator @sync_timer
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

// method decorator @async_timer
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
