// main.ts
var _Disposable;
try {
    var _usingCtx = _using_ctx();
    class Disposable {
        [Symbol.dispose]() {
            console.log('dispose');
        }
    }
    _Disposable = Disposable;
    var _disposable = _usingCtx.u(new Disposable());
    console.log('ok');
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
export { _Disposable as Disposable };
