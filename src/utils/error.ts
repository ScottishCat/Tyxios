import { HttpRequestConfig, HttpResponseConfig } from '../types/index'
export class HttpError extends Error {
    isError: boolean
    config: HttpRequestConfig
    code?: string | null
    request?: XMLHttpRequest
    response?: HttpResponseConfig

    constructor(message: string,
        config: HttpRequestConfig,
        code?: string | null,
        request?: XMLHttpRequest,
        response?: HttpResponseConfig
    ) {
        super(message);

        // 手动设置原型
        Object.setPrototypeOf(this, HttpError.prototype);

        this.config = config;
        this.code = code;
        this.request = request;
        this.response = response;
        this.isError = true;
    }
}

export function createHttpError(
    message: string,
    config: HttpRequestConfig,
    code?: string | null,
    request?: XMLHttpRequest,
    response?: HttpResponseConfig): HttpError {
    return new HttpError(message, config, code, request, response);
}