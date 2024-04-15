let i = 0;
let err;
try {
    try {
        var _usingCtx = _usingCtx2();
        const _x1 = _usingCtx.a({
            async [Symbol.asyncDispose]() {
                throw [1, ++i];
            }
        });
        const _x2 = _usingCtx.a({
            async [Symbol.asyncDispose]() {
                throw [2, ++i];
            }
        });
        const _x3 = _usingCtx.a({
            async [Symbol.asyncDispose]() {
                throw [3, ++i];
            }
        });
        const _x4 = _usingCtx.a({
            async [Symbol.asyncDispose]() {
                throw [4, ++i];
            }
        });
        throw [5, ++i];
    } catch (_) {
        _usingCtx.e = _;
    } finally {
        await _usingCtx.d();
    }
} catch (e) {
    err = e;
}