{
    try {
        var _stack = [];
        var x = _using(_stack, obj, true);
        stmt;
        var y = _using(_stack, obj, true), z = _using(_stack, obj, true);
        doSomethingWith(x, y);
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        await _dispose(_stack, _error, _hasError);
    }
}
