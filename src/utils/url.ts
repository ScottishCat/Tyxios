import { isDate, isObject } from './universal';

function encodeUrl(url: string): string {
    return encodeURIComponent(url)
        .replace(/%40/g, '@')
        .replace(/%3A/ig, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/ig, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/ig, '[')
        .replace(/%5D/ig, ']')
}

function ignoreHash(url: string): string {
    const index = url.indexOf('#');
    if (index !== -1) {
        url = url.slice(0, index);
    }
    return url;
}

export function buildUrl(url: string, params?: any): string {
    if (!params) {
        return url;
    }

    url = ignoreHash(url);

    const parts: string[] = [];

    Object.keys(params).forEach(key => {
        if (params[key] === null || typeof params[key] === 'undefined') {
            return
        }

        let value = [];

        // Convert params into array type
        if (Array.isArray(params[key])) {
            value = params[key];
            key += '[]';
        } else {
            value = [params[key]]
        }

        value.forEach((val: any) => {
            if (isDate(val)) {
                val = val.toISOString();
            } else {
                val = JSON.stringify(val);
            }
            parts.push(`${encodeUrl(key)}=${encodeUrl(val)}`);
        })
    })

    let resultURL = parts.join('&');

    if (resultURL) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + resultURL;
    }

    return url
}