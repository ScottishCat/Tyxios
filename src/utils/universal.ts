// cache of Object.prototype.toString
const toString = Object.prototype.toString;

export function isDate(val: any): val is Date {
    return toString.call(val) === '[object Date]';
}

export function isObject(val: any): val is Object {
    return toString.call(val) === '[object Object]';
}

export function assign<F, T>(from : F, to : T) : F & T {
    for (let key in from) {
        ;(to as F & T)[key] = from[key] as any
    }
    return to as F & T;
}