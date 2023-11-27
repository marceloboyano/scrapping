"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryCatch = void 0;
function TryCatch(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        try {
            return originalMethod.apply(this, args);
        }
        catch (error) {
            console.error(`Error happened: `, JSON.stringify(error));
        }
    };
    return descriptor;
}
exports.TryCatch = TryCatch;
