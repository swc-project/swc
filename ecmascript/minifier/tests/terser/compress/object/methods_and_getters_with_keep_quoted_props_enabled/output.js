var obj = {
    a() {},
    b() {},
    get c() {
        return "c";
    },
    get d() {
        return "d";
    },
    set e(a) {
        doSomething(a);
    },
    set f(a) {
        doSomething(b);
    },
};
