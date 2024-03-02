//// [usingDeclarationsWithLegacyClassDecorators.1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _ts_decorate = require("@swc/helpers/_/_ts_decorate"), _dispose = require("@swc/helpers/_/_dispose"), _using = require("@swc/helpers/_/_using");
try {
    var _stack = [];
    _using._(_stack, null);
    class C {
    }
    C = _ts_decorate._([
        dec
    ], C);
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    _dispose._(_stack, _error, _hasError);
}
