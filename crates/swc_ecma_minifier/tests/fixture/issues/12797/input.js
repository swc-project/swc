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
