var i, a;
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
new C().f(), new C().g(new B()), i.foo.foo(), i.foo.foo(), a().foo(), a().foo(), a(new B()).foo(), a(new B()).foo(), ({
    foo: (x)=>x.foo() + x.foo()
}).foo(new B());
