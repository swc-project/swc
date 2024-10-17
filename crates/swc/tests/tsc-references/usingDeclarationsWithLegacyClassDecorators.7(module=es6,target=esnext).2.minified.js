//// [usingDeclarationsWithLegacyClassDecorators.7.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
let env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    class C {
    }
    C = _ts_decorate([
        dec
    ], C), _ts_add_disposable_resource(env, null, !1);
} catch (e) {
    env.error = e, env.hasError = !0;
} finally{
    _ts_dispose_resources(env);
}
