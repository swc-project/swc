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
var _using_ctx = require("@swc/helpers/_/_using_ctx");
try {
    var _usingCtx = _using_ctx._();
    var _class = function _class() {
        "use strict";
        _class_call_check._(this, _class);
    };
    _class = _ts_decorate._([
        dec
    ], _class);
    var after = _usingCtx.u(null);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
