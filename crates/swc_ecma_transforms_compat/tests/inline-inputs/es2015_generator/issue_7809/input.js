
    function a(fn) {
        return _a.apply(this, arguments);
    }
    function _a() {
        _a = _async_to_generator(function*(fn) {
            (yield fn()).a = 1;
        });
        return _a.apply(this, arguments);
    }    
    