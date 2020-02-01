import { HttpRequestConfig, ResponsePromise, Method, HttpResponseConfig, InterceptorChain } from '../types/index';
import dispatchRequest from './dispatchRequest';
import InterceptorManager from './interceptormanager';
import mergeConfig from './mergeconfig';

export interface TyxiosInterceptor {
    request : InterceptorManager<HttpRequestConfig>
    response : InterceptorManager<HttpResponseConfig>
}

export default class Tyxios {

    interceptors : TyxiosInterceptor
    defaults : HttpRequestConfig

    constructor(config : HttpRequestConfig) {
        this.interceptors = {
            request : new InterceptorManager<HttpRequestConfig>(),
            response : new InterceptorManager<HttpResponseConfig>()
        }
        this.defaults = config
    }

    request(url : any, config ?: any): ResponsePromise {

        if (typeof url === 'string') {
            if (!config) {
                config = {};
            }
            config.url = url;
        } else {
            config = url;
        }

        config = mergeConfig(this.defaults, config);

        const interceptorChain : InterceptorChain<any>[] = [{
            resolved : dispatchRequest,
            rejected : undefined
        }]

        this.interceptors.request.forEach(interceptor => {
            interceptorChain.unshift(interceptor)
        })

        this.interceptors.response.forEach(interceptor => {
            interceptorChain.push(interceptor)
        })

        let promise = Promise.resolve(config);

        while (interceptorChain.length) {
            const {resolved, rejected} = interceptorChain.shift()!;
            promise = promise.then(resolved, rejected);
        }

        return promise;
    }

    _requestWithoutData(url: string, method: Method, config?: HttpRequestConfig): ResponsePromise {
        return this.request(Object.assign(config || {}, {
            url: url,
            method: method
        }))
    }

    _requestWithData(url: string, method: Method, config?: HttpRequestConfig, data?: any): ResponsePromise {
        return this.request(Object.assign(config || {}, {
            url: url,
            method: method,
            data: data
        }))
    }

    get(url: string, config?: HttpRequestConfig): ResponsePromise {
        return this._requestWithoutData(url, 'get', config);
    }

    delete(url: string, config?: HttpRequestConfig): ResponsePromise {
        return this._requestWithoutData(url, 'delete', config);
    }

    head(url: string, config?: HttpRequestConfig): ResponsePromise {
        return this._requestWithoutData(url, 'head', config);
    }

    options(url: string, config?: HttpRequestConfig): ResponsePromise {
        return this._requestWithoutData(url, 'options', config);
    }

    post(url: string, data?: any, config?: HttpRequestConfig): ResponsePromise {
        return this._requestWithData(url, 'post', config, data);
    }

    put(url: string, data?: any, config?: HttpRequestConfig): ResponsePromise {
        return this._requestWithData(url, 'put', config, data);
    }

    patch(url: string, data?: any, config?: HttpRequestConfig): ResponsePromise {
        return this._requestWithData(url, 'patch', config, data);
    }
}