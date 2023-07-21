export { fn as default };
try {
    var _stack = [];
    var x = _using(_stack, null);
    var fn = function fn() {};
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose(_stack, _error, _hasError);
}
