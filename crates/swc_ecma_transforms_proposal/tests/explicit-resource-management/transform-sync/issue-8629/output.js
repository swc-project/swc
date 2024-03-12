// main.ts
export class Disposable {
    [Symbol.dispose]() {
        console.log('dispose');
    }
}
try {
    var _stack = [];
    var _disposable = _using(_stack, new Disposable());
    console.log('ok');
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose(_stack, _error, _hasError);
}
