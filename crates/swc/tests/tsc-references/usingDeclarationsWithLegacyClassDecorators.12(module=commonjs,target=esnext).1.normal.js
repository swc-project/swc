//// [usingDeclarationsWithLegacyClassDecorators.12.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "D", {
    enumerable: true,
    get: function() {
        return C;
    }
});
const _ts_decorate = require("@swc/helpers/_/_ts_decorate");
const _using_ctx = require("@swc/helpers/_/_using_ctx");
try {
    var _usingCtx = _using_ctx._();
    class C {
    }
    C = _ts_decorate._([
        dec
    ], C);
    var after = _usingCtx.u(null);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
