//// [usingDeclarations.2.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
{
    try {
        var _usingCtx = _using_ctx();
        var d1 = _usingCtx.u(_define_property({}, Symbol.dispose, function() {})), d2 = _usingCtx.u(_define_property({}, Symbol.dispose, function() {}));
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        _usingCtx.d();
    }
}
