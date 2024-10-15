//// [awaitUsingDeclarations.3.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
{
    try {
        var _usingCtx = _using_ctx();
        const d1 = _usingCtx.a({
            async [Symbol.asyncDispose] () {}
        }), d2 = _usingCtx.a(null), d3 = _usingCtx.a(undefined), d4 = _usingCtx.a({
            [Symbol.dispose] () {}
        });
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        await _usingCtx.d();
    }
}export { };
