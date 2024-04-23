//// [awaitUsingDeclarationsTopLevelOfModule.1.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
try {
    var _x, _w, _usingCtx = _using_ctx();
    _x = 1;
    var z = _usingCtx.a({
        async [Symbol.asyncDispose] () {}
    });
    _w = 3;
    var _default = 4;
    console.log(3, 1, 2, z);
} catch (_) {
    _usingCtx.e = _;
} finally{
    await _usingCtx.d();
}
export { y, _default as default, _x as x, _w as w };
