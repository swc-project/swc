var _using_ctx = require("@swc/helpers/_/_using_ctx");
try {
    var _usingCtx = _using_ctx._();
    const foo = _usingCtx.u(null);
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
