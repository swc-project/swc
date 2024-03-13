import { doSomething } from "somewhere";
export * from "somewhere else";
export * as ns from "somewhere else";
function f() {
    a;
    B;
}
function h() {
    b;
    A;
}
var _g;
export { f };
var _b;
var _B;
try {
    var _stack = [];
    function g() {
        c;
    }
    _g = g;
    doSomething();
    let { b } = {};
    _b = b;
    var c = 2;
    class A {
    }
    class B {
    }
    _B = B;
    var x = _using(_stack, null);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose(_stack, _error, _hasError);
}
export { _g as g };
export { _b as b };
export { _B as B };
