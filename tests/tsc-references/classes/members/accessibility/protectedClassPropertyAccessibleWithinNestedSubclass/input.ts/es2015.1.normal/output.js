// @target: ES5
class B {
}
class C extends B {
    get y() {
        return this.x;
    }
    set y(x) {
        this.y = this.x;
    }
    foo() {
        return this.x;
    }
    static get y() {
        return this.x;
    }
    static set y(x1) {
        this.y = this.x;
    }
    static foo() {
        return this.x;
    }
    static bar() {
        this.foo();
    }
    bar() {
        class D {
            foo() {
                var c = new C();
                var c1 = c.y;
                var c2 = c.x;
                var c3 = c.foo;
                var c4 = c.bar;
                var c5 = c.z; // error
                var sc1 = C.x;
                var sc2 = C.y;
                var sc3 = C.foo;
                var sc4 = C.bar;
            }
        }
    }
}
class E extends C {
}
