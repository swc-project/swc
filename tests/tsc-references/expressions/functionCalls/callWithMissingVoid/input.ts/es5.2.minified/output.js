function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var X = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function X() {
        _classCallCheck(this, X);
    }
    return Constructor = X, protoProps = [
        {
            key: "f",
            value: function(t) {
                return {
                    a: t
                };
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), X;
}();
x.f(), xUnion.f(42), xUnion.f(), xAny.f(), xUnknown.f(), xNever.f();
var MyPromise = function(executor) {
    "use strict";
    _classCallCheck(this, MyPromise);
};
function a(x, y, z) {
}
function b(x, y, z, what) {
}
function c(x, y, z) {
}
new MyPromise(function(resolve) {
    return resolve();
}), new MyPromise(function(resolve) {
    return resolve();
}), new MyPromise(function(resolve) {
    return resolve();
}), new MyPromise(function(resolve) {
    return resolve();
}), new MyPromise(function(resolve) {
    return resolve();
}), a(4, "hello"), a(4, "hello", void 0), a(4), b(4, "hello", void 0, 2), b(4, "hello"), b(4, "hello", void 0), b(4), c(3, void 0, void 0), c(3, void 0), c(3), c(), call(function(x, y) {
    return x + y;
}), call(function(x, y) {
    return x + y;
}, 4, 2), call(function(x, y) {
    return x;
}, 4, void 0), call(function(x, y) {
    return x;
}, 4), call(function(x, y) {
    return 42;
}), call(function(x, y) {
    return 42;
}), call(function(x, y) {
    return 42;
}, 4), call(function(x, y) {
    return 42;
}, 4, 2) // ok
;
