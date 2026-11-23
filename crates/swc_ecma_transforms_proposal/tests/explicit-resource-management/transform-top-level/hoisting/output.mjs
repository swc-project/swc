const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    doSomething();
    var { b } = {};
    var c = 2;
    var A = class A {
    };
    var B = class B {
    };
    var x = _ts_add_disposable_resource(env, null, false);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
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
export { b };
export { B };
