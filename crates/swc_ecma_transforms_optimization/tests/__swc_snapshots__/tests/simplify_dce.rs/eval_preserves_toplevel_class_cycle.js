class A {
    method() {
        new B().method();
    }
}
class B extends A {
    method() {
        new A().method();
    }
}
eval('A');
