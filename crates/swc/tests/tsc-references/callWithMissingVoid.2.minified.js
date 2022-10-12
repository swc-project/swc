//// [callWithMissingVoid.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
x.f(), xUnion.f(42), xUnion.f(), xAny.f(), xUnknown.f(), xNever.f();
var MyPromise = function MyPromise(executor) {
    "use strict";
    _class_call_check(this, MyPromise);
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
}), call(function(x1, y) {
    return x1 + y;
}), call(function(x1, y) {
    return x1 + y;
}, 4, 2), call(function(x1, y) {
    return x1;
}, 4, void 0), call(function(x1, y) {
    return x1;
}, 4), call(function(x1, y) {
    return 42;
}), call(function(x1, y) {
    return 42;
}), call(function(x1, y) {
    return 42;
}, 4), call(function(x1, y) {
    return 42;
}, 4, 2);
