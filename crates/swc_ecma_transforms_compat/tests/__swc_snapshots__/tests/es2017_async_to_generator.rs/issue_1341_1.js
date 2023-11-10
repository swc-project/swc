class A {
    val = '1';
    foo() {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                return yield (function() {
                    var _ref = _async_to_generator(function*(x) {
                        return x + _this.val;
                    });
                    return function(x) {
                        return _ref.apply(this, arguments);
                    };
                })()('a');
            } catch (e) {
                throw e;
            }
        })();
    }
}
