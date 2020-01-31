import { isObject } from './universal';

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
        let [key, value] = line.split(':');
        if (!key) {
            return; 
        }
        key = key.trim().toLowerCase();
        value = value.trim();
        parsed[key] = value;
    })
    return parsed;
}