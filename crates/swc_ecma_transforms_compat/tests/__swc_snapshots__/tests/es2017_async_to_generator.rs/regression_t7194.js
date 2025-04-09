function f() {
    g(function() {
        return /*#__PURE__*/ _async_to_generator(function*() {
            var _this = this;
            c(function() {
                return _this;
            });
        }).call(this);
    });
}
(function() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var _this = this;
        console.log('async wrapper:', this === 'foo');
        (function() {
            console.log('nested arrow:', _this === 'foo');
        })();
    }).call(this);
}).call('foo');
