export function sync_timer(
  target: any,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor
): PropertyDescriptor {
  propertyDescriptor = propertyDescriptor || Object.getOwnPropertyDescriptor(target, propertyKey);

  const timername = (target instanceof Function ? `static ${target.name}` : target.constructor.name) + `::${propertyKey}`;
  const originalMethod = propertyDescriptor.value;
  propertyDescriptor.value = function (...args: any[]) {
    const t0 = new Date().valueOf();
    console.log(`[timer] [${timername}]: begin`);
    try {
      return originalMethod.apply(this, args);
    } finally {
      console.log(`[timer] [${timername}]: timer ${((new Date().valueOf() - t0) * 0.001).toFixed(3)}s`);
    }
  };
  return propertyDescriptor;
}

export function async_timer(
  target: any,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor
): PropertyDescriptor {
  propertyDescriptor = propertyDescriptor || Object.getOwnPropertyDescriptor(target, propertyKey);

  const timername = (target instanceof Function ? `static ${target.name}` : target.constructor.name) + `::${propertyKey}`;
  const originalMethod = propertyDescriptor.value;
  propertyDescriptor.value = async function (...args: any[]) {
    const t0 = new Date().valueOf();
    console.log(`[timer] [${timername}]: begin`);
    try {
      return await originalMethod.apply(this, args);
    } finally {
      console.log(`[timer] [${timername}]: timer ${((new Date().valueOf() - t0) * 0.001).toFixed(3)}s`);
    }
  };
  return propertyDescriptor;
}

export function sync_hrtimer(
  target: any,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor
): PropertyDescriptor {
  propertyDescriptor = propertyDescriptor || Object.getOwnPropertyDescriptor(target, propertyKey);

  const timername = (target instanceof Function ? `static ${target.name}` : target.constructor.name) + `::${propertyKey}`;
  const originalMethod = propertyDescriptor.value;
  propertyDescriptor.value = function (...args: any[]) {
    const t0 = process.hrtime.bigint();
    console.log(`[hrtimer] [${timername}]: begin`);
    try {
      return originalMethod.apply(this, args);
    } finally {
      console.log(`[hrtimer] [${timername}]: timer ${(process.hrtime.bigint() - t0)}ns`);
    }
  };
  return propertyDescriptor;
}

export function async_hrtimer(
  target: any,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor
): PropertyDescriptor {
  propertyDescriptor = propertyDescriptor || Object.getOwnPropertyDescriptor(target, propertyKey);

  const timername = (target instanceof Function ? `static ${target.name}` : target.constructor.name) + `::${propertyKey}`;
  const originalMethod = propertyDescriptor.value;
  propertyDescriptor.value = async function (...args: any[]) {
    const t0 = process.hrtime.bigint();
    console.log(`[hrtimer] [${timername}]: begin`);
    try {
      return await originalMethod.apply(this, args);
    } finally {
      console.log(`[hrtimer] [${timername}]: timer ${(process.hrtime.bigint() - t0)}ns`);
    }
  };
  return propertyDescriptor;
}
