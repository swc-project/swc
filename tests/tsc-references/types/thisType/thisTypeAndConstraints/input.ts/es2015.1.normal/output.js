class A {
    self() {
        return this;
    }
}
function f(x1) {
    function g(x) {
        x = x.self();
    }
    x1 = x1.self();
}
class B {
    foo(x) {
        x = x.self();
    }
    bar(x2) {
        x2 = x2.self();
    }
}
