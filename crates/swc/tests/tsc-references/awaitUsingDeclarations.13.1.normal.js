//// [awaitUsingDeclarations.13.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
function f() {
    try {
        var _usingCtx = _using_ctx();
        const x = _usingCtx.a(null);
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        await _usingCtx.d();
    }
}
try {
    var _usingCtx = _using_ctx();
    var x = _usingCtx.a(null);
} catch (_) {
    _usingCtx.e = _;
} finally{
    await _usingCtx.d();
}
