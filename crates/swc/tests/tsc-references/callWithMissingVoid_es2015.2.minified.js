x.f(), xUnion.f(42), xUnion.f(), xAny.f(), xUnknown.f(), xNever.f();
class MyPromise {
    constructor(executor){}
}
function a(x1, y, z) {}
function b(x1, y, z, what) {}
function c(x1, y, z) {}
new MyPromise((resolve)=>resolve()), new MyPromise((resolve)=>resolve()), new MyPromise((resolve)=>resolve()), new MyPromise((resolve)=>resolve()), new MyPromise((resolve)=>resolve()), a(4, "hello"), a(4, "hello", void 0), a(4), b(4, "hello", void 0, 2), b(4, "hello"), b(4, "hello", void 0), b(4), c(3, void 0, void 0), c(3, void 0), c(3), c(), call((x1, y)=>x1 + y), call((x1, y)=>x1 + y, 4, 2), call((x1, y)=>x1, 4, void 0), call((x1, y)=>x1, 4), call((x1, y)=>42), call((x1, y)=>42), call((x1, y)=>42, 4), call((x1, y)=>42, 4, 2);
