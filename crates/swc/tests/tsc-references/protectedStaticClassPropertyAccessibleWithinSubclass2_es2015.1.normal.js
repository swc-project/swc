class Base {
    static staticMethod() {
        this.x; // OK, accessed within their declaring class
    }
}
class Derived1 extends Base {
    static staticMethod1() {
        this.x; // OK, accessed within a class derived from their declaring class
        super.x; // Error, x is not public
    }
}
class Derived2 extends Derived1 {
    static staticMethod3() {
        this.x; // OK, accessed within a class derived from their declaring class
        super.x; // Error, x is not public
    }
}
