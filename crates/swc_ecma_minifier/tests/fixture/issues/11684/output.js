n = new function() {
    throw 1;
}();
class A {
}
g.foo = A, n = new A(1, 2, 3);
