{
    try {
        var _stack = [];
        var x = _using(_stack, obj);
        {
            try {
                var _stack1 = [];
                var y = _using(_stack1, call(()=>{
                    try {
                        var _stack = [];
                        var z = _using(_stack, obj);
                        return z;
                    } catch (_) {
                        var _error = _;
                        var _hasError = true;
                    } finally{
                        _dispose(_stack, _error, _hasError);
                    }
                }));
                stmt;
            } catch (_) {
                var _error = _;
                var _hasError = true;
            } finally{
                _dispose(_stack1, _error, _hasError);
            }
        }
        stmt;
    } catch (_) {
        var _error1 = _;
        var _hasError1 = true;
    } finally{
        _dispose(_stack, _error1, _hasError1);
    }
}
