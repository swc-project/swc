{
    try {
        var _stack = [];
        stmt;
        var x = _using(_stack, obj);
        stmt;
        var y = _using(_stack, obj), z = _using(_stack, obj);
        stmt;
        var w = _using(_stack, obj);
        doSomethingWith(x, z);
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        _dispose(_stack, _error, _hasError);
    }
}
