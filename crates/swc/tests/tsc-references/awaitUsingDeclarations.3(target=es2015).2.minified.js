//// [awaitUsingDeclarations.3.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
try {
    var _usingCtx = _using_ctx();
    _usingCtx.a({
        [Symbol.asyncDispose]: ()=>_async_to_generator(function*() {})()
    }), _usingCtx.a(null), _usingCtx.a(void 0), _usingCtx.a({
        [Symbol.dispose] () {}
    });
} catch (_) {
    _usingCtx.e = _;
} finally{
    await _usingCtx.d();
}
