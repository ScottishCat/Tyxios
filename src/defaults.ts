import { HttpRequestConfig } from "./types";
import { Method } from './types/index'

const methodsWithoutData : Method[] = ['get', 'delete', 'options', 'head'];
const methodWithData : Method[] = ['post', 'put', 'patch'];

const defaults : HttpRequestConfig = {
    method : 'get',
    timeout : 0,
    headers : {
        common : {
            Accept : 'application/json, text/plain, */*'
        }
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