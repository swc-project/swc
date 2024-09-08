function f() {
    g(/*#__PURE__*/ _async_to_generator(function*() {
        var _this = this;
        c(function() {
            return _this;
        });
    }));
}
/*#__PURE__*/ _async_to_generator(function*() {
    var _this = this;
    console.log('async wrapper:', this === 'foo');
    (function() {
        console.log('nested arrow:', _this === 'foo');
    })();
}).call('foo');
