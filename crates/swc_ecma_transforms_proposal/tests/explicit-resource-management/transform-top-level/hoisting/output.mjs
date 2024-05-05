import { doSomething } from "somewhere";
export * from "somewhere else";
export * as ns from "somewhere else";
var _g;
export { f };
var _b;
var _B;
try {
    var _usingCtx = _using_ctx();
    function f() {
        a;
        B;
    }
    function h() {
        b;
        A;
    }
    function g() {
        c;
    }
    _g = g;
    doSomething();
    let { b } = {};
    _b = b;
    let c = 2;
    class A {
    }
    class B {
    }
    _B = B;
    var x = _usingCtx.u(null);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
export { _g as g };
export { _b as b };
export { _B as B };
