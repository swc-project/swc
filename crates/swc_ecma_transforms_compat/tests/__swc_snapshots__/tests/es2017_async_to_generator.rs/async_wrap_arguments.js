function foo() {
    var _arguments = arguments;
    const bar = /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function*() {
            return _arguments;
        });
        return function bar() {
            return _ref.apply(this, arguments);
        };
    }();
}
