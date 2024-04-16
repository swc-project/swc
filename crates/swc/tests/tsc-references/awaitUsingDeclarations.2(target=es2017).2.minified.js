//// [awaitUsingDeclarations.2.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
try {
    var _usingCtx = _using_ctx();
    _usingCtx.a({
        async [Symbol.asyncDispose] () {}
    }), _usingCtx.a({
        async [Symbol.asyncDispose] () {}
    });
} catch (_) {
    _usingCtx.e = _;
} finally{
    await _usingCtx.d();
}
