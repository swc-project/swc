// @target: es6
class B {
    baz(a, y = 10) {
    }
}
class C extends B {
    foo() {
    }
    baz(a1, y1) {
        super.baz(a1, y1);
    }
}
class D extends C {
    foo() {
        super.foo();
    }
    baz() {
        super.baz("hello", 10);
    }
    constructor(){
        super();
    }
}
