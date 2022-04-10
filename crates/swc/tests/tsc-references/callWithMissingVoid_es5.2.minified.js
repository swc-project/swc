import * as swcHelpers from "@swc/helpers";
var X = function() {
    function X() {
        swcHelpers.classCallCheck(this, X);
    }
    return X.prototype.f = function(t) {
        return {
            a: t
        };
    }, X;
}();
x.f(), xUnion.f(42), xUnion.f(), xAny.f(), xUnknown.f(), xNever.f();
var MyPromise = function(executor) {
    swcHelpers.classCallCheck(this, MyPromise);
};
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
}), call(function(x, y) {
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
