// @target: ES5
// no errors
class C {
    get y() {
        return this.x;
    }
    set y(x) {
        this.y = this.x;
    }
    foo() {
        return this.foo;
    }
    static get y() {
        return this.x;
    }
    static set y(x1) {
        this.y = this.x;
    }
    static foo() {
        return this.foo;
    }
    static bar() {
        this.foo();
    }
    bar() {
        class C2 {
            foo() {
                let x;
                var x1 = x.foo;
                var x2 = x.bar;
                var x3 = x.x;
                var x4 = x.y;
                var sx1 = C.x;
                var sx2 = C.y;
                var sx3 = C.bar;
                var sx4 = C.foo;
                let y = new C();
                var y1 = y.foo;
                var y2 = y.bar;
                var y3 = y.x;
                var y4 = y.y;
            }
        }
    }
}
