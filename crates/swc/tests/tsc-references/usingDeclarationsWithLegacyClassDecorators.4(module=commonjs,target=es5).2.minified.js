//// [usingDeclarationsWithLegacyClassDecorators.4.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _class;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check"), _ts_decorate = require("@swc/helpers/_/_ts_decorate"), _ts_add_disposable_resource = require("@swc/helpers/_/_ts_add_disposable_resource"), _ts_dispose_resources = require("@swc/helpers/_/_ts_dispose_resources"), env = {
    stack: [],
    error: void 0,
    hasError: !1
};
try {
    _ts_add_disposable_resource._(env, null, !1), _class = _ts_decorate._([
        dec
    ], _class);
} catch (e) {
    env.error = e, env.hasError = !0;
} finally{
    _ts_dispose_resources._(env);
}
var _class = function _class() {
    _class_call_check._(this, _class);
};
