//// [usingDeclarationsInForOf.1.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
for(var _i = 0, _iter = [
    _define_property({}, Symbol.dispose, function() {}),
    null,
    void 0
]; _i < _iter.length; _i++){
    _iter[_i];
    try {
        var _usingCtx = _using_ctx();
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        _usingCtx.d();
    }
}
