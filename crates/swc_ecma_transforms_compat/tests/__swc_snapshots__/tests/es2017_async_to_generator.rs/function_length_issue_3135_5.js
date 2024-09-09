const foo = /*#__PURE__*/ function() {
    var _foo = _async_to_generator(function*(x, y, ...z) {
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
