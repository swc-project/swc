x.f(), xUnion.f(42), xUnion.f(), xAny.f(), xUnknown.f(), xNever.f();
class MyPromise {
    constructor(executor){}
}
function a(x, y, z) {}
function b(x, y, z, what) {}
function c(x, y, z) {}
new MyPromise((resolve)=>resolve()), new MyPromise((resolve)=>resolve()), new MyPromise((resolve)=>resolve()), new MyPromise((resolve)=>resolve()), new MyPromise((resolve)=>resolve()), a(4, "hello"), a(4, "hello", void 0), a(4), b(4, "hello", void 0, 2), b(4, "hello"), b(4, "hello", void 0), b(4), c(3, void 0, void 0), c(3, void 0), c(3), c(), call((x, y)=>x + y), call((x, y)=>x + y, 4, 2), call((x, y)=>x, 4, void 0), call((x, y)=>x, 4), call((x, y)=>42), call((x, y)=>42), call((x, y)=>42, 4), call((x, y)=>42, 4, 2);
