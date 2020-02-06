import { isObject, deepMerge } from './universal';
import { Method } from '../types';

const deleteHeaders : string[] = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];

function normalizeHeader(headers : any, normalizedName : string) : void {
    if (!headers) {
        return;
    }
    Object.keys(headers).forEach((name) => {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name];
            delete headers[name]; 
        }
    })
}

export function setHeaders(headers : any, data : any) : any {
    normalizeHeader(headers, 'Content-Type');
    if (isObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8';
        }
    }
    return headers;
}

export function parseHeaders(headers : string) : any {
    let parsed = Object.create(null);
    if (!headers) {
        return parsed;
    }
    headers.split('\r\n').forEach(line => {
        let [key, ...values] = line.split(':');
        key = key.trim().toLowerCase();
        if (!key) {
            return; 
        }
        let val = values.join(':').trim()
        parsed[key] = val;
    })
    return parsed;
}

export function flatenHeaders(headers : any, method : Method) : any {
    if (!headers) {
        return headers;
    }
    headers = deepMerge(headers.common || {}, headers[method] || {}, headers);
    deleteHeaders.forEach(header => {
        delete headers[header];
    })
    return headers;
}