class A {
    static{
        console.log('side effect');
    }
    method() {
        new B().method();
    }
}
class B extends A {
    method() {
        new A().method();
    }
}
