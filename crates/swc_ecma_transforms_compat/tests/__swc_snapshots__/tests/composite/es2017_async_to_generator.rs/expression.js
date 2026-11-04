var foo = function foo() {
    return _async_to_generator(function*() {
        var wat = yield bar();
    })();
};
var foo2 = function foo2() {
    return _async_to_generator(function*() {
        var wat = yield bar();
    })();
}, bar = function bar() {
    return _async_to_generator(function*() {
        var wat = yield foo();
    })();
};
