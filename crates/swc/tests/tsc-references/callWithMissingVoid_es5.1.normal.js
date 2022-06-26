import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @strict: true
// From #4260
var X = /*#__PURE__*/ function() {
    "use strict";
    function X() {
        _class_call_check(this, X);
    }
    var _proto = X.prototype;
    _proto.f = function f(t) {
        return {
            a: t
        };
    };
    return X;
}();
x.f() // no error because f expects void
;
xUnion.f(42) // no error because f accepts number
;
xUnion.f() // no error because f accepts void
;
xAny.f() // error, any still expects an argument
;
xUnknown.f() // error, unknown still expects an argument
;
xNever.f() // error, never still expects an argument
;
// Promise has previously been updated to work without arguments, but to show this fixes the issue too.
var MyPromise = function MyPromise(executor) {
    "use strict";
    _class_call_check(this, MyPromise);
};
new MyPromise(function(resolve) {
    return resolve();
}); // no error
new MyPromise(function(resolve) {
    return resolve();
}); // no error
new MyPromise(function(resolve) {
    return resolve();
}); // error, `any` arguments cannot be omitted
new MyPromise(function(resolve) {
    return resolve();
}); // error, `unknown` arguments cannot be omitted
new MyPromise(function(resolve) {
    return resolve();
}); // error, `never` arguments cannot be omitted
// Multiple parameters
function a(x1, y, z) {}
a(4, "hello"); // ok
a(4, "hello", void 0); // ok
a(4); // not ok
function b(x1, y, z, what) {}
b(4, "hello", void 0, 2); // ok
b(4, "hello"); // not ok
b(4, "hello", void 0); // not ok
b(4); // not ok
function c(x1, y, z) {}
c(3, void 0, void 0); // ok
c(3, void 0); // ok
c(3); // ok
c(); // ok
call(function(x1, y) {
    return x1 + y;
}) // error
;
call(function(x1, y) {
    return x1 + y;
}, 4, 2) // ok
;
call(function(x1, y) {
    return x1;
}, 4, void 0) // ok
;
call(function(x1, y) {
    return x1;
}, 4) // ok
;
call(function(x1, y) {
    return 42;
}) // ok
;
call(function(x1, y) {
    return 42;
}) // ok
;
call(function(x1, y) {
    return 42;
}, 4) // ok
;
call(function(x1, y) {
    return 42;
}, 4, 2) // ok
;
