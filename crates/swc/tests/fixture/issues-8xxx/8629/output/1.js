import { _ as _dispose } from "@swc/helpers/_/_dispose";
import { _ as _using } from "@swc/helpers/_/_using";
var _Disposable;
try {
    var _stack = [];
    var _computedKey;
    _computedKey = Symbol.dispose;
    class Disposable {
        [_computedKey]() {
            console.log('dispose');
        }
    }
    _Disposable = Disposable;
    var _disposable = _using(_stack, new Disposable());
    console.log('ok');
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose(_stack, _error, _hasError);
}
export { _Disposable as Disposable };
