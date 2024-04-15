//// [usingDeclarationsWithLegacyClassDecorators.10.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _class;
    }
});
const _ts_decorate = require("@swc/helpers/_/_ts_decorate"), _using_ctx = require("@swc/helpers/_/_using_ctx");
try {
    var _usingCtx = _using_ctx._(), _class = class {
    };
    _class = _ts_decorate._([
        dec
    ], _class), _usingCtx.u(null);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
