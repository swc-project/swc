var foo = function foo() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var wat = yield bar();
    })();
};
var foo2 = function foo2() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var wat = yield bar();
    })();
}, bar = function bar() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var wat = yield foo();
    })();
};
