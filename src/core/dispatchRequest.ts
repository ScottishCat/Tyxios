import { HttpRequestConfig, ResponsePromise, HttpResponseConfig } from '../types/index';
import { buildUrl, isAbsolute, concatUrl } from '../utils/url';
import { transformResponse } from '../utils/data';
import { flatenHeaders } from '../utils/header';
import transform from './transform';
import xhr from './xhr'

export default function dispatchRequest(config: HttpRequestConfig): ResponsePromise {
    throwIfRequested(config);
    processConfig(config);
    return xhr(config).then(
        res => {
            return transformResponseData(res);
        },
        e => {
            if (e && e.response) {
                e.response = transformResponseData(e.response)
            }
            return Promise.reject(e)
        }
    )
}

function processConfig(config: HttpRequestConfig): void {
    config.url = transformUrl(config);
    config.data = transform(config.data, config.headers, config.transformRequest);
    config.headers = flatenHeaders(config.headers, config.method!);
}

export function transformUrl(config: HttpRequestConfig): string {
    let { url, params, paramsSerializer, baseURL } = config;
    if (baseURL && !isAbsolute(url!)) {
        url = concatUrl(baseURL, url)
    }
    return buildUrl(url!, params, paramsSerializer);
}

function transformResponseData(response: HttpResponseConfig): HttpResponseConfig {
    response.data = transform(response.data, response.headers, response.config.transformResponse);
    return response;
}

function throwIfRequested(config: HttpRequestConfig): void {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
}
