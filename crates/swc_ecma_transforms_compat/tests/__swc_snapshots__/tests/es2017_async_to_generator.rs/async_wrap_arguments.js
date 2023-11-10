function foo() {
    var _arguments = arguments;
    const bar = function() {
        var _ref = _async_to_generator(function*() {
            return _arguments;
        });
        return function bar() {
            return _ref.apply(this, arguments);
        };
    }();
}
