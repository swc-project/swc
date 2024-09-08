function s(x) {
    return _s.apply(this, arguments);
}
function _s() {
    _s = _async_to_generator(function*(x) {
        for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            args[_key - 1] = arguments[_key];
        }
        var _this = this, _arguments = arguments;
        let t = /*#__PURE__*/ function() {
            var _t = _async_to_generator(function*(y, a) {
                let r = /*#__PURE__*/ function() {
                    var _r = _async_to_generator(function*(z, b) {
                        for(var _len = arguments.length, innerArgs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
                            innerArgs[_key - 2] = arguments[_key];
                        }
                        yield z;
                        console.log(_this, innerArgs, _arguments);
                        return _this.x;
                    });
                    function r(z, b) {
                        return _r.apply(this, arguments);
                    }
                    return r;
                }();
                yield r();
                console.log(_this, args, _arguments);
                return _this.g(r);
            });
            function t(y, a) {
                return _t.apply(this, arguments);
            }
            return t;
        }();
        yield t();
        return this.h(t);
    });
    return _s.apply(this, arguments);
}
