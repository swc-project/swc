//// [usingDeclarationsWithLegacyClassDecorators.10.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
var env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    _class = _ts_decorate([
        dec
    ], _class), _ts_add_disposable_resource(env, null, !1);
} catch (e) {
    env.error = e, env.hasError = !0;
} finally{
    _ts_dispose_resources(env);
}
var _class = function _class() {
    _class_call_check(this, _class);
};
export { _class as default };
