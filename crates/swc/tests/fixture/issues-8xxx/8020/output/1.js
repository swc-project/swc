import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
try {
    var _usingCtx = _using_ctx();
    var foo = _usingCtx.u(null);
    const bar = 1;
    console.log(baz());
    function baz() {
        return bar;
    }
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
