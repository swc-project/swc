//// [usingDeclarationsInForOf.1.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
for(var _i = 0, _iter = [
    _define_property({}, Symbol.dispose, function() {}),
    null,
    undefined
]; _i < _iter.length; _i++){
    var _ = _iter[_i];
    var env = {
        stack: [],
        error: void 0,
        hasError: false
    };
    try {
        var d1 = _ts_add_disposable_resource(env, _, false);
        {}
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        _ts_dispose_resources(env);
    }
}
