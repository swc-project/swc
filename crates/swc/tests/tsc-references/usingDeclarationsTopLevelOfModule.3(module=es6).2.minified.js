//// [usingDeclarationsTopLevelOfModule.3.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
try {
    var y, _usingCtx = _using_ctx();
    _usingCtx.u({
        [Symbol.dispose] () {}
    });
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
export { y };
