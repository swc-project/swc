//// [usingDeclarations.2.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
{
    try {
        var _usingCtx = _using_ctx();
        const d1 = _usingCtx.u({
            [Symbol.dispose] () {}
        }), d2 = _usingCtx.u({
            [Symbol.dispose] () {}
        });
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        _usingCtx.d();
    }
}
