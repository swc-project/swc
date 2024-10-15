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
const _using_ctx = require("@swc/helpers/_/_using_ctx");
try {
    var _usingCtx = _using_ctx._();
    var before = _usingCtx.u(null);
    var _class = class _class {
    };
    _class = _ts_decorate._([
        dec
    ], _class);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
