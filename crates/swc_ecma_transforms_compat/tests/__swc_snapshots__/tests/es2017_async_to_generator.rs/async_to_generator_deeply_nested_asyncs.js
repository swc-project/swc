function s(x) {
    return _s.apply(this, arguments);
}
function _s() {
    _s = _async_to_generator(function*(x, ...args) {
        var _this = this, _arguments = arguments;
        let t = /*#__PURE__*/ function() {
            var _ref = _async_to_generator(function*(y, a) {
                let r = /*#__PURE__*/ function() {
                    var _ref = _async_to_generator(function*(z, b, ...innerArgs) {
                        yield z;
                        console.log(_this, innerArgs, _arguments);
                        return _this.x;
                    });
                    return function r(z, b) {
                        return _ref.apply(this, arguments);
                    };
                }();
                yield r();
                console.log(_this, args, _arguments);
                return _this.g(r);
            });
            return function t(y, a) {
                return _ref.apply(this, arguments);
            };
        }();
        yield t();
        return this.h(t);
    });
    return _s.apply(this, arguments);
}
