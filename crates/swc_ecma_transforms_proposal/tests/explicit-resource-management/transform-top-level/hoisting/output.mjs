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
export function g() {
    c;
}
export { f };
export let { b } = {};
export class B {
}
try {
    var _stack = [];
    doSomething();
    var c = 2;
    class A {
    }
    var x = _using(_stack, null);
} catch (_) {
    var _error = _;
    var _hasError = true;
} finally{
    _dispose(_stack, _error, _hasError);
}
