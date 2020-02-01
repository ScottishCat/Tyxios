import { HttpRequestConfig, ResponsePromise, HttpResponseConfig } from '../types/index';
import { buildUrl } from '../utils/url';
import { transformResponse } from '../utils/data';
import { flatenHeaders } from '../utils/header';
import transform from './transform';
import xhr from './xhr'

export default function dispatchRequest(config: HttpRequestConfig): ResponsePromise {
    processConfig(config);
    return xhr(config).then((res: any) => {
        return transformResponseData(res);
    });
}

function processConfig(config: HttpRequestConfig): void {
    config.url = transformUrl(config);
    config.data = transform(config.data, config.headers, config.transformRequest);
    config.headers = flatenHeaders(config.headers, config.method!);
}

function transformUrl(config: HttpRequestConfig): string {
    const { url, params } = config;
    return buildUrl(url!, params);
}

function transformResponseData(response: HttpResponseConfig): HttpResponseConfig {
    response.data = transform(response.data, response.headers, response.config.transformResponse);
    return response;
}
