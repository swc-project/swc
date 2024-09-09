const foo = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function*(x, y, ...z) {
        return 42;
    });
    return function foo(x, y) {
        return _ref.apply(this, arguments);
    };
}();
