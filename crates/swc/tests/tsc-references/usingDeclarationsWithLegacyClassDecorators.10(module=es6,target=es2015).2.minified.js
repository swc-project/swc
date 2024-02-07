//// [usingDeclarationsWithLegacyClassDecorators.10.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
try {
    var _stack = [], _class = class {
    };
    _class = _ts_decorate([
        dec
    ], _class), _using(_stack, null);
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    _dispose(_stack, _error, _hasError);
}
export { _class as default };
