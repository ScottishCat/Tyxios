import { TyxiosInstance, HttpRequestConfig } from './types/index';
import Tyxios from './core/Tyxios';
import { assign } from './utils/universal';
import defaults from './defaults';

export function createInstance(config: HttpRequestConfig) : TyxiosInstance{
    const context = new Tyxios(config);
    const instance = Tyxios.prototype.request.bind(context);
    assign(context, instance);
    return instance as TyxiosInstance;
}

const tyxios = createInstance(defaults);
export default tyxios;