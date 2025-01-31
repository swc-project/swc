//// [usingDeclarations.2.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
{
    var env = {
        stack: [],
        error: void 0,
        hasError: false
    };
    try {
        var d1 = _ts_add_disposable_resource(env, _define_property({}, Symbol.dispose, function() {}), false), d2 = _ts_add_disposable_resource(env, _define_property({}, Symbol.dispose, function() {}), false);
    } catch (e) {
        env.error = e;
        env.hasError = true;
    } finally{
        _ts_dispose_resources(env);
    }
}
