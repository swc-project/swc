let TestClass = {
    name: "John Doe",
    testMethodFailure () {
        var _this = this;
        return new Promise(function(resolve) {
            return _async_to_generator(function*() {
                console.log(_this);
                setTimeout(resolve, 1000);
            })();
        });
    }
};
