!(function (factory) {
    factory();
})(function () {
    return (function (fn) {
        fn()().prop();
    })(function () {
        function bar() {
            var quux = function () {
                    console.log("PASS");
                },
                foo = function () {
                    console.log;
                    quux();
                };
            return { prop: foo };
        }
        return bar;
    });
});
