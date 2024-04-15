//// [usingDeclarationsDeclarationEmit.2.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
try {
    var _usingCtx = _using_ctx();
    var r1 = _usingCtx.u({
        [Symbol.dispose] () {}
    });
    var r2 = _usingCtx.a({
        async [Symbol.asyncDispose] () {}
    });
} catch (_) {
    _usingCtx.e = _;
} finally{
    await _usingCtx.d();
}
export { };
