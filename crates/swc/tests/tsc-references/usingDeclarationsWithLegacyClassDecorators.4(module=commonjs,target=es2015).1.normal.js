//// [usingDeclarationsWithLegacyClassDecorators.4.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _class;
    }
});
const _ts_decorate = require("@swc/helpers/_/_ts_decorate");
const _ts_add_disposable_resource = require("@swc/helpers/_/_ts_add_disposable_resource");
const _ts_dispose_resources = require("@swc/helpers/_/_ts_dispose_resources");
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    const before = _ts_add_disposable_resource._(env, null, false);
    ;
    _class = _ts_decorate._([
        dec
    ], _class);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources._(env);
}
class _class {
}
