var foo = function() {
    return _async_to_generator(function*() {
        var wat = yield bar();
    })();
};
var foo2 = function() {
    return _async_to_generator(function*() {
        var wat = yield bar();
    })();
}, bar = function() {
    return _async_to_generator(function*() {
        var wat = yield foo();
    })();
};
