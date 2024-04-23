//// [usingDeclarationsWithLegacyClassDecorators.8.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "C", {
    enumerable: true,
    get: function() {
        return _C;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var _using_ctx = require("@swc/helpers/_/_using_ctx");
var _C;
try {
    var _usingCtx = _using_ctx._();
    var C = function C() {
        "use strict";
        _class_call_check._(this, C);
    };
    _C = C;
    C = _ts_decorate._([
        dec
    ], C);
    var after = _usingCtx.u(null);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
