//// [usingDeclarationsWithLegacyClassDecorators.10.ts]
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
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var _dispose = require("@swc/helpers/_/_dispose");
var _using = require("@swc/helpers/_/_using");
try {
    var _stack = [];
    var _class = function _class() {
        "use strict";
        _class_call_check._(this, _class);
    };
    _class = _ts_decorate._([
        dec
    ], _class);
    var after = _using._(_stack, null);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose._(_stack, _error, _hasError);
}
