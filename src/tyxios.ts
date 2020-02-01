import { TyxiosInstance, HttpRequestConfig, TyxiosGenerator } from './types/index';
import Tyxios from './core/Tyxios';
import { assign } from './utils/universal';
import defaults from './defaults';
import mergeConfig from './core/mergeconfig';

export function createInstance(config: HttpRequestConfig) : TyxiosGenerator{
    const context = new Tyxios(config);
    const instance = Tyxios.prototype.request.bind(context);
    assign(context, instance);
    return instance as TyxiosGenerator;
}

const tyxios = createInstance(defaults);
tyxios.create = function (config) {
    return createInstance(mergeConfig(defaults, config))
}

export default tyxios;