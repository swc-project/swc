let TestClass = {
    name: "John Doe",
    testMethodFailure () {
        var _this = this;
        return new Promise(/*#__PURE__*/ function() {
            var _ref = _async_to_generator(function*(resolve) {
                console.log(_this);
                setTimeout(resolve, 1000);
            });
            return function(resolve) {
                return _ref.apply(this, arguments);
            };
        }());
    }
};
