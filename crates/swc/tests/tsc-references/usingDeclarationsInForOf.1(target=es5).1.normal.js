//// [usingDeclarationsInForOf.1.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _dispose } from "@swc/helpers/_/_dispose";
for(var _i = 0, _iter = [
    _define_property({}, Symbol.dispose, function() {}),
    null,
    undefined
]; _i < _iter.length; _i++){
    var d1 = _iter[_i];
    try {
        var _stack = [];
        {}
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        _dispose(_stack, _error, _hasError);
    }
}
