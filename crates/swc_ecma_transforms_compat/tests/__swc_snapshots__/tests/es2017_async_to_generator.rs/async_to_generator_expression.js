var foo = function() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var wat = yield bar();
    })();
};
var foo2 = function() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var wat = yield bar();
    })();
}, bar = function() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var wat = yield foo();
    })();
};
