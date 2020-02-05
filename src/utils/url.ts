import { isDate, isObject, isURLSearchParams } from './universal';

function encodeUrl(url: string): string {
    return encodeURIComponent(url)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']')
}

export function isAbsolute(url: string): boolean {
    return /^([a-z][a-z\d+\-\.]*:)?\/\//i.test(url)
}

export function concatUrl(baseUrl: string, relativeUrl?: string): string {
    return relativeUrl ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseUrl
}

export function buildUrl(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
    if (!params) {
        return url;
    }

    let resultURL;

    if (paramsSerializer) {
        resultURL = paramsSerializer(params);
    } else if (isURLSearchParams(params)) {
        resultURL = params.toString();
    } else {
        const parts: string[] = [];

        Object.keys(params).forEach(key => {
            if (params[key] === null || typeof params[key] === 'undefined') {
                return
            }

            let values = [];

            // Convert params into array type
            if (Array.isArray(params[key])) {
                values = params[key];
                key += '[]';
            } else {
                values = [params[key]]
            }

            values.forEach((val: any) => {
                if (isDate(val)) {
                    val = val.toISOString();
                } else if (isObject(val)) {
                    val = JSON.stringify(val);
                }
                parts.push(`${encodeUrl(key)}=${encodeUrl(val)}`);
            })
        })

        resultURL = parts.join('&');
    }

    if (resultURL) {
        const markIndex = url.indexOf('#')
        if (markIndex !== -1) {
            url = url.slice(0, markIndex)
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + resultURL
    }

    return url
}

export function isSameOrigin(requestURL: string): boolean {
    const parsedOrigin = resolveURL(requestURL);
    return (parsedOrigin === currentOrigin);
}

const urlParsingNode = document.createElement('a');
const currentOrigin = resolveURL(window.location.href);

function resolveURL(url: string): string {
    urlParsingNode.setAttribute('href', url);
    const { origin } = urlParsingNode;
    return origin;
}