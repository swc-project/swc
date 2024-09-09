var foo = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function*() {
        var wat = yield bar();
    });
    return function foo() {
        return _ref.apply(this, arguments);
    };
}();
var foo2 = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function*() {
        var wat = yield bar();
    });
    return function foo2() {
        return _ref.apply(this, arguments);
    };
}(), bar = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function*() {
        var wat = yield foo();
    });
    return function bar() {
        return _ref.apply(this, arguments);
    };
}();
