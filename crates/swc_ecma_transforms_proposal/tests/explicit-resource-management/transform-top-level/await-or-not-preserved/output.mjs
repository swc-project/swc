export { x, y };
try {
    var _stack = [];
    var x = _using(_stack, A);
    var y = _using(_stack, B, true);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    await _dispose(_stack, _error, _hasError);
}
