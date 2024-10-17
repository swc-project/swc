//// [usingDeclarationsWithLegacyClassDecorators.2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "C", {
    enumerable: !0,
    get: function() {
        return C;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check"), _ts_decorate = require("@swc/helpers/_/_ts_decorate"), _ts_add_disposable_resource = require("@swc/helpers/_/_ts_add_disposable_resource"), _ts_dispose_resources = require("@swc/helpers/_/_ts_dispose_resources"), env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    _ts_add_disposable_resource._(env, null, !1), C = _ts_decorate._([
        dec
    ], C);
} catch (e) {
    env.error = e, env.hasError = !0;
} finally{
    _ts_dispose_resources._(env);
}
var C = function C() {
    _class_call_check._(this, C);
};
