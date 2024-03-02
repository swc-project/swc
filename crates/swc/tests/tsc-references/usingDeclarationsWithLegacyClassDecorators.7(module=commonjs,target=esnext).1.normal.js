//// [usingDeclarationsWithLegacyClassDecorators.7.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _ts_decorate = require("@swc/helpers/_/_ts_decorate");
const _dispose = require("@swc/helpers/_/_dispose");
const _using = require("@swc/helpers/_/_using");
try {
    var _stack = [];
    class C {
    }
    C = _ts_decorate._([
        dec
    ], C);
    var after = _using._(_stack, null);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose._(_stack, _error, _hasError);
}
