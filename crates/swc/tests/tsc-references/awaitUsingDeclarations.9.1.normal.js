//// [awaitUsingDeclarations.9.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
{
    try {
        var _usingCtx = _using_ctx();
        const a = _usingCtx.a(null);
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        await _usingCtx.d();
    }
}export { };
