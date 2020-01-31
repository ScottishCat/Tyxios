import { isObject } from './universal';
export function transformRequest(data : any) : any {
    if (isObject(data)) {
        return JSON.stringify(data);
    }
    return data;
}

export function transformResponse(data : any) : any {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        }
        catch(err) {
            alert(err);
        }
    }
    return data;
}