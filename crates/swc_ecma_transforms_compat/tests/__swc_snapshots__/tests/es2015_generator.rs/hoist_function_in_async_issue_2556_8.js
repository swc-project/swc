var fib = function fib() {
    return 42;
};
function init() {
    return /*#__PURE__*/ _async_to_generator(function() {
        function fib(n) {
            return /*#__PURE__*/ _async_to_generator(function() {
                var x, y;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            if (n <= 1) {
                                return [
                                    2,
                                    n
                                ];
                            }
                            return [
                                4,
                                fib(n - 1)
                            ];
                        case 1:
                            x = _state.sent();
                            return [
                                4,
                                fib(n - 2)
                            ];
                        case 2:
                            y = _state.sent();
                            return [
                                2,
                                x + y
                            ];
                    }
                });
            })();
        }
        return _ts_generator(this, function(_state) {
            return [
                2,
                fib
            ];
        });
    })();
}
