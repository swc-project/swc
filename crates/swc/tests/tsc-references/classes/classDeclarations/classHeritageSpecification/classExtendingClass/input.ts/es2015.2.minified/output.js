var d, d2;
class C {
    thing() {
    }
    static other() {
    }
}
d.foo, d.bar, d.thing(), (class extends C {
}).other();
class C2 {
    thing(x) {
    }
    static other(x1) {
    }
}
d2.foo, d2.bar, d2.thing(""), (class extends C2 {
}).other(1);
