foo(), bar(), baz(), qux();
// The cases below must keep the class.
class F {
    static set(x) {
        F.value = x;
    }
    static cache = foo();
}
F.value = 1;
class G {
    static set(x) {
        G.value = x;
    }
    static cache = foo(G);
}
class H {
    static{
        H.value = foo();
    }
}
class I {
    static set(x) {
        I.value = x;
    }
    static cache = foo();
}
I.set(1);
class L {
    static set(x) {
        L.value = x;
    }
    static cache = foo();
}
Object.assign(L, {
    value: 1
});
