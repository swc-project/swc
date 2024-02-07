//// [usingDeclarationsWithLegacyClassDecorators.5.ts]
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
const _ts_decorate = require("@swc/helpers/_/_ts_decorate");
const _dispose = require("@swc/helpers/_/_dispose");
const _using = require("@swc/helpers/_/_using");
try {
    var _stack = [];
    var before = _using._(_stack, null);
    class C {
    }
    C = _ts_decorate._([
        dec
    ], C);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose._(_stack, _error, _hasError);
}
