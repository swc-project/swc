const foo = /*#__PURE__*/ function() {
    var _ref = _wrap_async_generator(function*(x, y, ...z) {
        return 42;
    });
    return function foo(x, y) {
        return _ref.apply(this, arguments);
    };
}();
