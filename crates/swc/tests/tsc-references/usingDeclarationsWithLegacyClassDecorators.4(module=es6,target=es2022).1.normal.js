//// [usingDeclarationsWithLegacyClassDecorators.4.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
export { _class as default };
try {
    var _stack = [];
    var before = _using(_stack, null);
    var _class = class _class {
    };
    _class = _ts_decorate([
        dec
    ], _class);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose(_stack, _error, _hasError);
}
