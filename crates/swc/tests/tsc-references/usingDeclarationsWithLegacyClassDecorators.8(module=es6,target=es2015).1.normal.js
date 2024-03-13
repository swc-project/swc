//// [usingDeclarationsWithLegacyClassDecorators.8.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
var _C;
try {
    var _stack = [];
    class C {
    }
    _C = C;
    C = _ts_decorate([
        dec
    ], C);
    var after = _using(_stack, null);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose(_stack, _error, _hasError);
}
export { _C as C };
