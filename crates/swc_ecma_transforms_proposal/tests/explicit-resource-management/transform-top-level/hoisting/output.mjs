const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    function f() {
        a;
        B;
    }
    function h() {
        b;
        A;
    }
    doSomething();
    let c = 2;
    class A {
    }
    const x = _ts_add_disposable_resource(env, null, false);
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
import { doSomething } from "somewhere";
export * from "somewhere else";
export * as ns from "somewhere else";
export function g() {
    c;
}
export { f };
export let { b } = {};
export class B {
}
