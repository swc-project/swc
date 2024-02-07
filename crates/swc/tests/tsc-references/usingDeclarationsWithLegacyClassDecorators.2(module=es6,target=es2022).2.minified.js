//// [usingDeclarationsWithLegacyClassDecorators.2.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
export class C {
}
try {
    var _stack = [];
    _using(_stack, null), C = _ts_decorate([
        dec
    ], C);
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    _dispose(_stack, _error, _hasError);
}
