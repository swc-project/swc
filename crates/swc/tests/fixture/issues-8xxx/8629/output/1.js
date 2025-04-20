import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var _computedKey;
    _computedKey = Symbol.dispose;
    var Disposable = class {
        [_computedKey]() {
            console.log('dispose');
        }
    };
    var _disposable = _ts_add_disposable_resource(env, new Disposable(), false);
    console.log('ok');
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
export { Disposable };
