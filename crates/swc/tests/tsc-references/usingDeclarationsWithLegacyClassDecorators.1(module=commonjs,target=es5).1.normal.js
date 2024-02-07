//// [usingDeclarationsWithLegacyClassDecorators.1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var _dispose = require("@swc/helpers/_/_dispose");
var _using = require("@swc/helpers/_/_using");
try {
    var _stack = [];
    var before = _using._(_stack, null);
    var C = function C() {
        "use strict";
        _class_call_check._(this, C);
    };
    C = _ts_decorate._([
        dec
    ], C);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose._(_stack, _error, _hasError);
}
