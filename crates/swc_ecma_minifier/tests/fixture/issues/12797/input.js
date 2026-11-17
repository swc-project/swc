class C {
    static set(x) { C.value = x; }
    static cache = foo();
}

class D {
    set(x) { D.value = x; }
    static cache = bar();
}

class E {
    static set(x) { E.value = x; }
    static cache = new Map();
}

// A self mutation through a call or `new` argument in the class body does not
// keep the class either.
class J {
    static set(x) {
        Object.assign(J, x);
    }
    static cache = baz();
}

class K {
    set(x) {
        new Foo(K, x);
    }
    static cache = qux();
}

// The cases below must keep the class.

class F {
    static set(x) { F.value = x; }
    static cache = foo();
}
F.value = 1;

class G {
    static set(x) { G.value = x; }
    static cache = foo(G);
}

class H {
    static {
        H.value = foo();
    }
}

class I {
    static set(x) { I.value = x; }
    static cache = foo();
}
I.set(1);

class L {
    static set(x) {
        L.value = x;
    }
    static cache = foo();
}
Object.assign(L, { value: 1 });
