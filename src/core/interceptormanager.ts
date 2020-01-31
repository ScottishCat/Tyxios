import { ResolveFunction, RejectFunction, Interceptor } from '../types/index';

export default class InterceptorManager<T> {
    private interceptors : Array<Interceptor<T> | null>

    constructor() {
        this.interceptors = []
    }

    use(resolved : ResolveFunction<T>, rejected ?: RejectFunction<T>) : number {
        this.interceptors.push({
            resolved, rejected
        })
        return this.interceptors.length - 1;
    }

    eject(id : number) : void {
        if (this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }

    forEach(func : (interceptor : Interceptor<T>) => void) : void {
        this.interceptors.forEach(interceptor => {
            if (interceptor !== null) {
                func(interceptor);
            }
        })
    }
}