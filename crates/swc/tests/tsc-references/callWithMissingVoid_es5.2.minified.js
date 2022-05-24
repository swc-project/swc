import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var X = function() {
    "use strict";
    function X() {
        _class_call_check(this, X);
    }
    return X.prototype.f = function(t) {
        return {
            a: t
        };
    }, X;
}();
x.f(), xUnion.f(42), xUnion.f(), xAny.f(), xUnknown.f(), xNever.f();
var MyPromise = function(executor) {
    "use strict";
    _class_call_check(this, MyPromise);
};
function a(x, y, z) {}
function b(x, y, z, what) {}
function c(x, y, z) {}
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
}, 4, 2);
