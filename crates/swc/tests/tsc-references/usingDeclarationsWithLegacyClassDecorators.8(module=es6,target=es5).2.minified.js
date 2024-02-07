//// [usingDeclarationsWithLegacyClassDecorators.8.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
export var C = function C() {
    _class_call_check(this, C);
};
try {
    var _stack = [];
    C = _ts_decorate([
        dec
    ], C), _using(_stack, null);
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    _dispose(_stack, _error, _hasError);
}
