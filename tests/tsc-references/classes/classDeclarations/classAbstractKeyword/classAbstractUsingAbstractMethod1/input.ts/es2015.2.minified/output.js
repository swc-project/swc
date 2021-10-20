class A {
}
var a = new class extends A {
    foo() {
        return 1;
    }
};
a.foo(), (a = new class extends A {
}).foo();
