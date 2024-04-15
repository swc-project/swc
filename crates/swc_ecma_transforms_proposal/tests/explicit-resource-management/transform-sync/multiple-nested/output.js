{
    try {
        var _usingCtx = _using_ctx();
        const x = _usingCtx.u(obj);
        {
            try {
                var _usingCtx1 = _using_ctx();
                const y = _usingCtx1.u(call(()=>{
                    try {
                        var _usingCtx = _using_ctx();
                        const z = _usingCtx.u(obj);
                        return z;
                    } catch (_) {
                        _usingCtx.e = _;
                    } finally{
                        _usingCtx.d();
                    }
                }));
                stmt;
            } catch (_) {
                _usingCtx1.e = _;
            } finally{
                _usingCtx1.d();
            }
        }
        stmt;
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        _usingCtx.d();
    }
}
