class A {
    self() {
        return this;
    }
}
function f(x) {
    function g(x) {
        x = x.self();
    }
    x = x.self();
}
class B {
    foo(x) {
        x = x.self();
    }
    bar(x) {
        x = x.self();
    }
}
