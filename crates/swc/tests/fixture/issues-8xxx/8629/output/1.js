import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
var _Disposable;
try {
    var _usingCtx = _using_ctx();
    var _computedKey;
    _computedKey = Symbol.dispose;
    class Disposable {
        [_computedKey]() {
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
