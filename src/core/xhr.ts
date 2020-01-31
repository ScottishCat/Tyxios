import { HttpRequestConfig, ResponsePromise, HttpResponseConfig } from '../types/index';
import { parseHeaders } from '../utils/header';
import { createHttpError } from '../utils/error';

export default function xhr(config: HttpRequestConfig): ResponsePromise {
    return new Promise((resolve, reject) => {
        const { url, method = "GET", data = null, params = null, headers, responseType, timeout } = config;
        const request = new XMLHttpRequest();

        // 设置Response类型
        if (responseType) {
            request.responseType = responseType;
        }

        // 设置超时阈值
        if (timeout) {
            request.timeout = timeout;
        }

        request.open(method.toUpperCase(), url!, true);
        request.onreadystatechange = () => {
            if (request.readyState !== 4) {
                return
            }
            
            if (request.status === 0) {
                return 
            }

            const responseHeaders = parseHeaders(request.getAllResponseHeaders());
            const responseData = responseType === 'text' ? request.responseText : request.response;
            const response: HttpResponseConfig = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config: config,
                request: request
            };
            handleResponse(response);
        }

        // 处理网络异常
        request.onerror = () => {
            reject(createHttpError("Network Error !", config, null, request));
        } 
        
        // 处理超时异常
        request.ontimeout = () => {
            reject(createHttpError(`Timeout of ${timeout} exceeded`, config, 'ECONNABORTED', request));
        }

        function handleResponse(response : HttpResponseConfig) : void {
            if (response.status >= 200 && response.status < 300) {
                resolve(response);
            } else {
                reject(createHttpError(`Request failed with status code ${response.status}`, config, null, request, response));
            }
        }

        Object.keys(headers).forEach((name) => {
            if (name.toLocaleLowerCase() === 'content-type' && data === null) {
                delete headers[name];
            } else {
                request.setRequestHeader(name, headers[name]);
            }
        })
        request.send(data);
    })

}