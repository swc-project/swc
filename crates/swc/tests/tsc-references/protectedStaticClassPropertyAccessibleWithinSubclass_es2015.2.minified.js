class Base {
    static staticMethod() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }
}
class Derived1 extends Base {
    static staticMethod1() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }
}
class Derived2 extends Base {
    static staticMethod2() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }
}
class Derived3 extends Derived1 {
    static staticMethod3() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }
}
Base.x, Derived1.x, Derived2.x, Derived3.x;
