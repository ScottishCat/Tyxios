import { HttpRequestConfig, ResponsePromise, HttpResponseConfig} from '../types/index';
import { buildUrl } from '../utils/url';
import { transformRequest, transformResponse } from '../utils/data';
import { setHeaders} from '../utils/header';
import xhr from './xhr'

export default function dispatchRequest(config: HttpRequestConfig) : ResponsePromise{
    processConfig(config);
    return xhr(config).then((res : any) => {
        return transformResponseData(res);
    });
}

function processConfig(config : HttpRequestConfig) : void {
    config.url = transformUrl(config);
    config.headers = transformHeaders(config);
    config.data = transformRequestData(config);
}

function transformUrl(config : HttpRequestConfig) : string {
    const {url, params} = config;
    return buildUrl(url!, params);
}

function transformRequestData(config : HttpRequestConfig) : any {
    return transformRequest(config.data);
}

function transformHeaders(config : HttpRequestConfig) : any {
    const { headers = {}, data} = config;
    return setHeaders(headers, data);
    
}

function transformResponseData(response : HttpResponseConfig) : HttpResponseConfig {
    response.data = transformResponse(response.data);
    return response;
}
