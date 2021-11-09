// @declaration: true
class A {
    method() {
        class B {
            method() {
                new A(); // OK
            }
        }
        class C extends A {
        }
    }
    constructor(){
    }
}
class D {
    method() {
        class E {
            method() {
                new D(); // OK
            }
        }
        class F extends D {
        }
    }
    constructor(){
    }
}
