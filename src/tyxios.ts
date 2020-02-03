import { TyxiosInstance, HttpRequestConfig, TyxiosGenerator } from './types/index';
import Tyxios from './core/Tyxios';
import { assign } from './utils/universal';
import defaults from './defaults';
import mergeConfig from './core/mergeconfig';
import CancelToken from './cancel/CancelToken';
import Cancel, {isCancel} from './cancel/Cancel';

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

tyxios.CancelToken = CancelToken
tyxios.Cancel = Cancel
tyxios.isCancel = isCancel

export default tyxios;