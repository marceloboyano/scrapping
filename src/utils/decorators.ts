export function TryCatchDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
  
    descriptor.value = function (...args: any[]) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        console.error(`Error happened: `, JSON.stringify(error));
      }
    };
  
    return descriptor;
}