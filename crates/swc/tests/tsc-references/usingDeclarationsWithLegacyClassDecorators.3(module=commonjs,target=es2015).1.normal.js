//// [usingDeclarationsWithLegacyClassDecorators.3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return C;
    }
});
const _ts_decorate = require("@swc/helpers/_/_ts_decorate");
const _using_ctx = require("@swc/helpers/_/_using_ctx");
try {
    var _usingCtx = _using_ctx._();
    var before = _usingCtx.u(null);
    var C = class C {
    };
    C = _ts_decorate._([
        dec
    ], C);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
