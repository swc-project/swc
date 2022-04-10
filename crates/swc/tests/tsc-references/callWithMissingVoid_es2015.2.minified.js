x.f(), xUnion.f(42), xUnion.f(), xAny.f(), xUnknown.f(), xNever.f();
class MyPromise {
    constructor(executor){}
}
new MyPromise((resolve)=>resolve()
), new MyPromise((resolve)=>resolve()
), new MyPromise((resolve)=>resolve()
), new MyPromise((resolve)=>resolve()
), new MyPromise((resolve)=>resolve()
), call((x, y)=>x + y
), call((x, y)=>x + y
, 4, 2), call((x, y)=>x
, 4, void 0), call((x, y)=>x
, 4), call((x, y)=>42
), call((x, y)=>42
), call((x, y)=>42
, 4), call((x, y)=>42
, 4, 2);
