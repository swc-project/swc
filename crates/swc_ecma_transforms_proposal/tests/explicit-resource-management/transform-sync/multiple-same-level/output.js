{
    try {
        var _stack = [];
        stmt;
        const x = _using(_stack, obj);
        stmt;
        const y = _using(_stack, obj), z = _using(_stack, obj);
        stmt;
        const w = _using(_stack, obj);
        doSomethingWith(x, z);
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        _dispose(_stack, _error, _hasError);
    }
}
