class A {
}
class B extends A {
    foo() {
        return 1;
    }
}
class C extends A {
}
var a = new B;
a.foo();
a = new C; // error, cannot instantiate abstract class.
a.foo();
