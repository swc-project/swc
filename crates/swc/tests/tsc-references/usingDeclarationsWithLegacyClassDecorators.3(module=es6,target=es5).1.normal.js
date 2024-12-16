//// [usingDeclarationsWithLegacyClassDecorators.3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_add_disposable_resource } from "@swc/helpers/_/_ts_add_disposable_resource";
import { _ as _ts_dispose_resources } from "@swc/helpers/_/_ts_dispose_resources";
var env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var before = _ts_add_disposable_resource(env, null, false);
    C = _ts_decorate([
        dec
    ], C);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
export { C as default };
