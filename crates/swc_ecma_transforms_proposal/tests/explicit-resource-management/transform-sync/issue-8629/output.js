// main.ts
var _Disposable;
try {
    var _stack = [];
    class Disposable {
        [Symbol.dispose]() {
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
