{
    try {
        var _stack = [];
        var a = _using(_stack, 1);
        var b = _using(_stack, 2, true);
        var c = _using(_stack, 3);
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        await _dispose(_stack, _error, _hasError);
    }
}
