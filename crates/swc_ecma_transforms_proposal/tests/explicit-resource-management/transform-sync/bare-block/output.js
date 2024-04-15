{
    try {
        var _usingCtx = _using_ctx();
        const x = _usingCtx.u(obj);
        doSomethingWith(x);
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        _usingCtx.d();
    }
}
