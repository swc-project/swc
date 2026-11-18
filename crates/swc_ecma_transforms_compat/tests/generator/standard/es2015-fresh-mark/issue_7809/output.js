function a(fn) {
    return _a.apply(this, arguments);
}
function _a() {
    _a = _async_to_generator(function(fn) {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fn()
                    ];
                case 1:
                    _state.sent().a = 1;
                    return [
                        2
                    ];
            }
        });
    });
    return _a.apply(this, arguments);
}
