class Base {
    method() {
        var b1;
        var d11;
        var d21;
        var d31;
        var d41;
        b1.x; // OK, accessed within their declaring class
        d11.x; // OK, accessed within their declaring class
        d21.x; // OK, accessed within their declaring class
        d31.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
        d41.x; // OK, accessed within their declaring class
    }
}
class Derived1 extends Base {
    method1() {
        var b2;
        var d12;
        var d22;
        var d32;
        var d42;
        b2.x; // Error, isn't accessed through an instance of the enclosing class
        d12.x; // OK, accessed within a class derived from their declaring class, and through an instance of the enclosing class
        d22.x; // Error, isn't accessed through an instance of the enclosing class
        d32.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
        d42.x; // Error, isn't accessed through an instance of the enclosing class
    }
}
class Derived2 extends Base {
    method2() {
        var b3;
        var d13;
        var d23;
        var d33;
        var d43;
        b3.x; // Error, isn't accessed through an instance of the enclosing class
        d13.x; // Error, isn't accessed through an instance of the enclosing class
        d23.x; // OK, accessed within a class derived from their declaring class, and through an instance of the enclosing class
        d33.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
        d43.x; // OK, accessed within a class derived from their declaring class, and through an instance of the enclosing class or one of its subclasses
    }
}
class Derived3 extends Derived1 {
    method3() {
        var b4;
        var d14;
        var d24;
        var d34;
        var d44;
        b4.x; // Error, isn't accessed through an instance of the enclosing class
        d14.x; // Error, isn't accessed through an instance of the enclosing class
        d24.x; // Error, isn't accessed through an instance of the enclosing class
        d34.x; // OK, accessed within their declaring class
        d44.x; // Error, isn't accessed through an instance of the enclosing class
    }
}
class Derived4 extends Derived2 {
    method4() {
        var b5;
        var d15;
        var d25;
        var d35;
        var d45;
        b5.x; // Error, isn't accessed through an instance of the enclosing class
        d15.x; // Error, isn't accessed through an instance of the enclosing class
        d25.x; // Error, isn't accessed through an instance of the enclosing class
        d35.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
        d45.x; // OK, accessed within a class derived from their declaring class, and through an instance of the enclosing class
    }
}
var b;
var d1;
var d2;
var d3;
var d4;
b.x; // Error, neither within their declaring class nor classes derived from their declaring class
d1.x; // Error, neither within their declaring class nor classes derived from their declaring class
d2.x; // Error, neither within their declaring class nor classes derived from their declaring class
d3.x; // Error, neither within their declaring class nor classes derived from their declaring class
d4.x; // Error, neither within their declaring class nor classes derived from their declaring class
