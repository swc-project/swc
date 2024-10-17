//// [usingDeclarationsWithLegacyClassDecorators.2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "C", {
    enumerable: true,
    get: function() {
        return C;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var _ts_add_disposable_resource = require("@swc/helpers/_/_ts_add_disposable_resource");
var _ts_dispose_resources = require("@swc/helpers/_/_ts_dispose_resources");
var env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var before = _ts_add_disposable_resource._(env, null, false);
    ;
    C = _ts_decorate._([
        dec
    ], C);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources._(env);
}
var C = function C() {
    "use strict";
    _class_call_check._(this, C);
};
