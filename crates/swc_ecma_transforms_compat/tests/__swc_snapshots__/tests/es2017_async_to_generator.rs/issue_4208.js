function foo() {
    var _this = this;
    const bar = /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function*(baz = _this.baz) {
            console.log(_this);
        });
        return function bar() {
            return _ref.apply(this, arguments);
        };
    }();
}
