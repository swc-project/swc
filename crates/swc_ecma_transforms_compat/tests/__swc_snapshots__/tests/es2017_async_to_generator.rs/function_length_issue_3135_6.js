const foo = function() {
    var _foo = _wrap_async_generator(function*(x, y, ...z) {
        if (x) {
            return foo(0, y);
        }
        return 0;
    });
    function foo(x, y) {
        return _foo.apply(this, arguments);
    }
    return foo;
}();
