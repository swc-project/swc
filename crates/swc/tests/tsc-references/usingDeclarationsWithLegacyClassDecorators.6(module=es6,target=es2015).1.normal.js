//// [usingDeclarationsWithLegacyClassDecorators.6.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
export { C as D };
try {
    var _stack = [];
    var before = _using(_stack, null);
    class C {
    }
    C = _ts_decorate([
        dec
    ], C);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose(_stack, _error, _hasError);
}
