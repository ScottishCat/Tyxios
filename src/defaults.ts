import { HttpRequestConfig } from "./types";
import { Method } from './types/index';
import { setHeaders } from './utils/header';
import { transformRequest, transformResponse } from './utils/data';

const methodsWithoutData : Method[] = ['get', 'delete', 'options', 'head'];
const methodWithData : Method[] = ['post', 'put', 'patch'];

const defaults : HttpRequestConfig = {
    method : 'get',
    timeout : 0,
    headers : {
        common : {
            Accept : 'application/json, text/plain, */*'
        }
    },
    transformRequest : [function(data : any, headers : any) : any {
        setHeaders (headers, data);
        return transformRequest(data);
    }],
    transformResponse : [function(data : any) : any {
        return transformResponse(data);
    }],
    xsrfCookieName : 'XSRF-TOKEN',
    xsrfHeaderName : 'XSRF-HEADER',

    validateStatus : function (status: number) : boolean {
        return status >= 200 && status < 300;
    }
}

methodsWithoutData.forEach(method => {
    defaults.headers[method] = {}
})

methodWithData.forEach(method => {
    defaults.headers[method] = {
        'Content-Type' : 'application/x-www-form-urlencoded'
    }
})

export default defaults;