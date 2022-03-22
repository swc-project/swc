class A {
    foo() {
        return '';
    }
}
class B extends A {
    bar() {
        return '';
    }
}
class C {
    f() {
        var x;
        return x.foo() + x.foo();
    }
    g(x) {
        return x.foo() + x.foo();
    }
}
new C().f(), new C().g(new B()), i.foo.foo(), i.foo.foo(), a().foo(), a().foo();
var i, a, aB = new B();
a(aB, aB).foo(), a(aB, aB).foo(), ({
    foo: (x, y)=>x.foo() + x.foo()
}).foo(aB, aB);
