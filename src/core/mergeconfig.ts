import { HttpRequestConfig } from "../types";
import { isObject, deepMerge } from "../utils/universal";

const mergeMethod = Object.create(null);

const ignoreDefaultMergeKeys = ['url', 'params', 'data'];
const complexMergeKeys = ['headers'];

ignoreDefaultMergeKeys.forEach(key => {
    mergeMethod[key] = ignoreDefaultMerge;
})

complexMergeKeys.forEach(key => {
    mergeMethod[key] = complexMerge;
})

export default function mergeConfig(config1: HttpRequestConfig, config2?: HttpRequestConfig): HttpRequestConfig {
    if (!config2) {
        config2 = {}
    }
    let merged = Object.create(null);

    function mergeField(key: string): void {
        const method = mergeMethod[key] || defaultMerge
        merged[key] = method(config1[key], config2![key]);
    }

    for (let key in config2) {
        mergeField(key);
    }

    for (let key in config1) {
        if (!config2[key]) {
            mergeField(key);
        }
    }

    return merged;
}

function defaultMerge(field1: any, field2: any): any {
    return typeof field2 !== 'undefined' ? field2 : field1;
}

function ignoreDefaultMerge(field1: any, field2: any): any {
    if (typeof field2 !== 'undefined') {
        return field2;
    }
}

function complexMerge(field1: any, field2: any): any {
    if (isObject(field2)) {
        return deepMerge(field1, field2);
    } else if (typeof field2 !== 'undefined') {
        return field2;
    } else if (isObject(field1)) {
        return deepMerge(field1);
    } else if (typeof field1 !== 'undefined') {
        return field1;
    }
}

