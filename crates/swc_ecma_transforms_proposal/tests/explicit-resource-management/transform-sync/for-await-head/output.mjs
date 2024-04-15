for await (const x of y){
    try {
        var _usingCtx = _using_ctx();
        {
            doSomethingWith(x);
        }
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        _usingCtx.d();
    }
}
