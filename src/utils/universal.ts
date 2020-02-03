// cache of Object.prototype.toString
const toString = Object.prototype.toString;

export function isDate(val: any): val is Date {
    return toString.call(val) === '[object Date]';
}

export function isObject(val: any): val is Object {
    return toString.call(val) === '[object Object]';
}

export function assign<F, T>(from: F, to: T): F & T {
    for (let key in from) {
        ; (to as F & T)[key] = from[key] as any
    }
    return to as F & T;
}

export function deepMerge(...objs: any[]): any {
    const merged = Object.create(null)
    objs.forEach(obj => {
        if (obj) {
          Object.keys(obj).forEach(key => {
            const val = obj[key]
            if (isObject(val)) {
              if (isObject(merged[key])) {
                merged[key] = deepMerge(merged[key], val)
              } else {
                merged[key] = deepMerge({}, val)
              }
            } else {
                merged[key] = val
            }
          })
        }
      })
    return merged;
}

export function isFormData(val : any) : val is FormData {
    return typeof val !== 'undefined' && val instanceof FormData;
}