//// [usingDeclarationsDeclarationEmit.1.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
try {
    var _usingCtx = _using_ctx(), r1 = _usingCtx.u({
        [Symbol.dispose] () {}
    }), r2 = _usingCtx.a({
        async [Symbol.asyncDispose] () {}
    });
} catch (_) {
    _usingCtx.e = _;
} finally{
    await _usingCtx.d();
}
export { r1, r2 };
