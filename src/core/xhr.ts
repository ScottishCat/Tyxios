import { HttpRequestConfig, ResponsePromise, HttpResponseConfig } from '../types/index';
import { parseHeaders } from '../utils/header';
import { createHttpError } from '../utils/error';
import { isSameOrigin } from '../utils/url';
import cookie from '../utils/cookie';
import { isFormData } from '../utils/universal';

export default function xhr(config: HttpRequestConfig): ResponsePromise {
    return new Promise((resolve, reject) => {
        const { url, method, data = null, headers = {}, responseType, timeout, cancelToken, withCredentials, xsrfCookieName, xsrfHeaderName, onDownloadProgress, onUploadProgress, auth, validateStatus } = config;
        const request = new XMLHttpRequest();

        request.open(method!.toUpperCase(), url!, true);

        configRequest()
        addEvents()
        processHeaders()
        processCancel()

        request.send(data);

        function handleResponse(response: HttpResponseConfig): void {
            if (!validateStatus || validateStatus(response.status)) {
                resolve(response);
            } else {
                reject(createHttpError(`Request failed with status code ${response.status}`, config, null, request, response));
            }
        }

        function configRequest(): void {
            // 设置Response类型
            if (responseType) {
                request.responseType = responseType;
            }

            // 设置超时阈值
            if (timeout) {
                request.timeout = timeout;
            }

            if (withCredentials) {
                request.withCredentials = withCredentials
            }
        }

        function addEvents(): void {
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return
                }

                if (request.status === 0) {
                    return
                }

                const responseHeaders = parseHeaders(request.getAllResponseHeaders());
                const responseData = responseType && responseType !== 'text' ? request.response : request.responseText
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
                reject(createHttpError("Network Error", config, null, request));
            }

            // 处理超时异常
            request.ontimeout = () => {
                reject(createHttpError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request));
            }

            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress
            }

            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress
            }
        }

        function processHeaders(): void {

            if (auth) {
                headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
            }

            if (isFormData(data)) {
                delete headers['Content-Type']
            }

            if ((withCredentials || isSameOrigin(url!)) && xsrfCookieName) {
                const xsrfToken = cookie.readCookie(xsrfCookieName);
                if (xsrfToken && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfToken;
                }
            }

            Object.keys(headers).forEach((name) => {
                if (name.toLocaleLowerCase() === 'content-type' && data === null) {
                    delete headers[name];
                } else {
                    request.setRequestHeader(name, headers[name]);
                }
            })
        }

        function processCancel(): void {
            if (cancelToken) {
                cancelToken.promise.then(reason => {
                    request.abort();
                    reject(reason);
                })
            }
        }
    })

}