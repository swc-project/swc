function s(_0) {
    return _async_to_generator(function*(x) {
        for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            args[_key - 1] = arguments[_key];
        }
        var _this = this, _arguments = arguments;
        let t = function t(y, a) {
            return _async_to_generator(function*() {
                let r = function r(_0, _1) {
                    return _async_to_generator(function*(z, b) {
                        for(var _len = arguments.length, innerArgs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
                            innerArgs[_key - 2] = arguments[_key];
                        }
                        yield z;
                        console.log(_this, innerArgs, _arguments);
                        return _this.x;
                    }).apply(this, arguments);
                };
                yield r();
                console.log(_this, args, _arguments);
                return _this.g(r);
            })();
        };
        yield t();
        return this.h(t);
    }).apply(this, arguments);
}
