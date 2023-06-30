for (const x of y){
    try {
        var _stack = [];
        {
            doSomethingWith(x);
        }
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        _dispose(_stack, _error, _hasError);
    }
}
