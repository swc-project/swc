//// [usingDeclarationsInForOf.1.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
for(var _i = 0, _iter = [
    _define_property({}, Symbol.dispose, function() {}),
    null,
    void 0
]; _i < _iter.length; _i++){
    _iter[_i];
    try {
        var _stack = [];
    } catch (_) {
        var _error = _, _hasError = !0;
    } finally{
        _dispose(_stack, _error, _hasError);
    }
}
