//// [usingDeclarationsTopLevelOfModule.3.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
export { y };
try {
    var _usingCtx = _using_ctx();
    var z = _usingCtx.u({
        [Symbol.dispose] () {}
    });
    if (false) {
        var y = 1;
    }
    function f() {
        console.log(y, z);
    }
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
