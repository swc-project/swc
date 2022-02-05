const C = class {
    foo(v) {
        return v;
    }
};
C.a, C.a = 1, C[2], C[2] = 42;
const c = new C();
c.foo(1);
