//// [callWithMissingVoid.ts]
// From #4260
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
x.f() // no error because f expects void
, xUnion.f(42) // no error because f accepts number
, xUnion.f() // no error because f accepts void
, xAny.f() // error, any still expects an argument
, xUnknown.f() // error, unknown still expects an argument
, xNever.f() // error, never still expects an argument
;
// Promise has previously been updated to work without arguments, but to show this fixes the issue too.
var MyPromise = function MyPromise(executor) {
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
}) // error
, call(function(x1, y) {
    return x1 + y;
}, 4, 2) // ok
, call(function(x1, y) {
    return x1;
}, 4, void 0) // ok
, call(function(x1, y) {
    return x1;
}, 4) // ok
, call(function(x1, y) {
    return 42;
}) // ok
, call(function(x1, y) {
    return 42;
}) // ok
, call(function(x1, y) {
    return 42;
}, 4) // ok
, call(function(x1, y) {
    return 42;
}, 4, 2) // ok
;
