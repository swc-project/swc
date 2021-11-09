class A {
    foo() {
        return "";
    }
}
class B extends A {
    bar() {
        return "";
    }
}
new A(), new B(), new B();
