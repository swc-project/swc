export default function(x) {
    return _ref.apply(this, arguments);
}
function _ref() {
    _ref = _async_to_generator(function*(x) {
        function bar(y) {
            return _bar.apply(this, arguments);
        }
        function _bar() {
            _bar = _async_to_generator(function*(y) {
                (function() {
                    var _ref = _async_to_generator(function*(z) {
                        return x(y)(z);
                    });
                    return function(z) {
                        return _ref.apply(this, arguments);
                    };
                })()();
            });
            return _bar.apply(this, arguments);
        }
    });
    return _ref.apply(this, arguments);
}
