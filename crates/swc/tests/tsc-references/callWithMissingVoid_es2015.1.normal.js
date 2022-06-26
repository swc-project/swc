// @strict: true
// From #4260
class X {
    f(t) {
        return {
            a: t
        };
    }
}
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
class MyPromise {
    constructor(executor){}
}
new MyPromise((resolve)=>resolve()); // no error
new MyPromise((resolve)=>resolve()); // no error
new MyPromise((resolve)=>resolve()); // error, `any` arguments cannot be omitted
new MyPromise((resolve)=>resolve()); // error, `unknown` arguments cannot be omitted
new MyPromise((resolve)=>resolve()); // error, `never` arguments cannot be omitted
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
call((x1, y)=>x1 + y) // error
;
call((x1, y)=>x1 + y, 4, 2) // ok
;
call((x1, y)=>x1, 4, void 0) // ok
;
call((x1, y)=>x1, 4) // ok
;
call((x1, y)=>42) // ok
;
call((x1, y)=>42) // ok
;
call((x1, y)=>42, 4) // ok
;
call((x1, y)=>42, 4, 2) // ok
;
