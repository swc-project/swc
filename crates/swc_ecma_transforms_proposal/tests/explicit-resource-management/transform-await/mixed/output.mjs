{
    try {
        var _stack = [];
        const a = _using(_stack, 1);
        const b = _using(_stack, 2, true);
        const c = _using(_stack, 3);
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        await _dispose(_stack, _error, _hasError);
    }
}
