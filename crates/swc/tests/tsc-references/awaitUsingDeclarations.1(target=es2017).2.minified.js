//// [awaitUsingDeclarations.1.ts]
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
try {
    var _usingCtx = _using_ctx();
    _usingCtx.a({
        async [Symbol.asyncDispose] () {}
    });
    try {
        var _usingCtx1 = _using_ctx();
        _usingCtx1.a({
            async [Symbol.asyncDispose] () {}
        });
    } catch (_) {
        _usingCtx1.e = _;
    } finally{
        await _usingCtx1.d();
    }
    switch(Math.random()){
        case 0:
            try {
                var _usingCtx2 = _using_ctx();
                _usingCtx2.a({
                    async [Symbol.asyncDispose] () {}
                });
                break;
            } catch (_) {
                _usingCtx2.e = _;
            } finally{
                await _usingCtx2.d();
            }
        case 1:
            try {
                var _usingCtx3 = _using_ctx();
                _usingCtx3.a({
                    async [Symbol.asyncDispose] () {}
                });
            } catch (_) {
                _usingCtx3.e = _;
            } finally{
                await _usingCtx3.d();
            }
    }
    try {
        var _usingCtx4 = _using_ctx();
        _usingCtx4.a({
            async [Symbol.asyncDispose] () {}
        });
    } catch (_) {
        _usingCtx4.e = _;
    } finally{
        await _usingCtx4.d();
    }
    try {
        try {
            var _usingCtx5 = _using_ctx();
            _usingCtx5.a({
                async [Symbol.asyncDispose] () {}
            });
        } catch (_) {
            _usingCtx5.e = _;
        } finally{
            await _usingCtx5.d();
        }
    } catch (e) {
        try {
            var _usingCtx6 = _using_ctx();
            _usingCtx6.a({
                async [Symbol.asyncDispose] () {}
            });
        } catch (_) {
            _usingCtx6.e = _;
        } finally{
            await _usingCtx6.d();
        }
    } finally{
        try {
            var _usingCtx7 = _using_ctx();
            _usingCtx7.a({
                async [Symbol.asyncDispose] () {}
            });
        } catch (_) {
            _usingCtx7.e = _;
        } finally{
            await _usingCtx7.d();
        }
    }
    try {
        var _usingCtx8 = _using_ctx();
        _usingCtx8.a({
            async [Symbol.asyncDispose] () {}
        });
    } catch (_) {
        _usingCtx8.e = _;
    } finally{
        await _usingCtx8.d();
    }
    for(;;)try {
        var _usingCtx10 = _using_ctx();
        _usingCtx10.a({
            async [Symbol.asyncDispose] () {}
        });
        break;
    } catch (_) {
        _usingCtx10.e = _;
    } finally{
        await _usingCtx10.d();
    }
    for(;;)try {
        var _usingCtx11 = _using_ctx();
        _usingCtx11.a({
            async [Symbol.asyncDispose] () {}
        });
        break;
    } catch (_) {
        _usingCtx11.e = _;
    } finally{
        await _usingCtx11.d();
    }
    for(;;)try {
        var _usingCtx12 = _using_ctx();
        _usingCtx12.a({
            async [Symbol.asyncDispose] () {}
        });
        break;
    } catch (_) {
        _usingCtx12.e = _;
    } finally{
        await _usingCtx12.d();
    }
    for(let x in {})try {
        var _usingCtx13 = _using_ctx();
        _usingCtx13.a({
            async [Symbol.asyncDispose] () {}
        });
    } catch (_) {
        _usingCtx13.e = _;
    } finally{
        await _usingCtx13.d();
    }
    for (let x of [])try {
        var _usingCtx14 = _using_ctx();
        _usingCtx14.a({
            async [Symbol.asyncDispose] () {}
        });
    } catch (_) {
        _usingCtx14.e = _;
    } finally{
        await _usingCtx14.d();
    }
} catch (_) {
    _usingCtx.e = _;
} finally{
    await _usingCtx.d();
}
