//// [awaitUsingDeclarationsTopLevelOfModule.1.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
var _x;
export { y };
var _w;
export { _default as default };
try {
    var _usingCtx = _using_ctx();
    const x = 1;
    _x = x;
    var z = _usingCtx.a({
        async [Symbol.asyncDispose] () {}
    });
    const y = 2;
    const w = 3;
    _w = w;
    var _default = 4;
    console.log(w, x, y, z);
} catch (_) {
    _usingCtx.e = _;
} finally{
    await _usingCtx.d();
}
export { _x as x };
export { _w as w };
