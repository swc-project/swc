//// [usingDeclarationsWithLegacyClassDecorators.10.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _class;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check"), _ts_decorate = require("@swc/helpers/_/_ts_decorate"), _dispose = require("@swc/helpers/_/_dispose"), _using = require("@swc/helpers/_/_using");
try {
    var _stack = [], _class = function _class() {
        _class_call_check._(this, _class);
    };
    _class = _ts_decorate._([
        dec
    ], _class), _using._(_stack, null);
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    _dispose._(_stack, _error, _hasError);
}
