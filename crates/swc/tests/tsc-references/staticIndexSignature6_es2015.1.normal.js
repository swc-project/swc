// @strict: true
function foo() {
    return class {
        foo(v) {
            return v;
        }
    };
}
const C = foo();
C.a;
C.a = 1;
C[2];
C[2] = 42;
const c = new C();
c.foo(1);
