//// [awaitUsingDeclarations.12.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
async function f() {
    try {
        var _usingCtx = _using_ctx();
        const x = _usingCtx.a({});
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        await _usingCtx.d();
    }
}
