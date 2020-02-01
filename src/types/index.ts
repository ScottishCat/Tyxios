import { transformResponse } from "../utils/data";

export type Method =
    "get" | "GET" |
    "post" | "POST" |
    "delete" | "DELETE" |
    "put" | "PUT" |
    "patch" | "PATCH" |
    "head" | "HEAD" |
    "options" | "OPTIONS";

export interface HttpRequestConfig {
    url?: string,
    method?: Method,
    data?: any,
    params?: any,
    headers?: any,
    responseType?: XMLHttpRequestResponseType,
    timeout?: number,
    transformRequest ?: TyxiosTransformer | TyxiosTransformer[]
    transformResponse ?: TyxiosTransformer | TyxiosTransformer[] 

    [propName : string] : any
}

export interface HttpResponseConfig<T=any> {
    data: any,
    status: number,
    statusText: string,
    headers: any,
    config: HttpRequestConfig,
    request: XMLHttpRequest
}

export interface ResponsePromise<T=any> extends Promise<HttpResponseConfig<T>> {

}

export interface HttpError extends Error {
    isError: boolean,
    config: HttpRequestConfig,
    code?: string | null,
    request?: XMLHttpRequest,
    response?: HttpResponseConfig
}

export interface Tyxios {

    defaults : HttpRequestConfig

    interceptors : {
        request : TyxiosInterceptorManager<HttpRequestConfig>
        response : TyxiosInterceptorManager<HttpResponseConfig>
    }

    request<T=any>(config: HttpRequestConfig): ResponsePromise<T>
    get<T=any>(url: string, config?: HttpRequestConfig): ResponsePromise<T>
    delete<T=any>(url: string, config?: HttpRequestConfig): ResponsePromise<T>
    head<T=any>(url: string, config?: HttpRequestConfig): ResponsePromise<T>
    options<T=any>(url: string, config?: HttpRequestConfig): ResponsePromise<T>
    post<T=any>(url: string, data?: any, config?: HttpRequestConfig): ResponsePromise<T>
    put<T=any>(url: string, data?: any, config?: HttpRequestConfig): ResponsePromise<T>
    patch<T=any>(url: string, data?: any, config?: HttpRequestConfig): ResponsePromise<T>
}

export interface TyxiosInstance extends Tyxios {
    <T=any>(config: HttpRequestConfig): ResponsePromise<T>
    <T=any>(url: string, config?: HttpRequestConfig): ResponsePromise<T>
}

export interface TyxiosInterceptorManager<T> {
    use(resolve : ResolveFunction<T>, reject ?: RejectFunction<T>) : number
    eject(id : number) : void
}

export interface Interceptor<T> {
    resolved : ResolveFunction<T>
    rejected ?: RejectFunction<T>
}

export interface ResolveFunction<T> {
    (val : T) : T | Promise<T>
}

export interface RejectFunction<T> {
    (error : any) : any
}

export interface InterceptorChain<T> {
    resolved : ResolveFunction<T> | ((config: HttpRequestConfig) => ResponsePromise) 
    rejected ?: RejectFunction<T>
}

export interface TyxiosTransformer {
    (data : any, headers ?: any) : any
}

export interface TyxiosGenerator extends TyxiosInstance {
    create(config ?: HttpRequestConfig) : TyxiosInstance
}