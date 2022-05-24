class A {
    foo() {
        return '';
    }
}
new class {
    f() {
        var x;
        return x.foo() + x.foo() + x.notHere();
    }
}().f(), i.foo.notHere(), i.foo.foo(), a().notHere(), a().foo();
var i, a, b = {
    foo: (x)=>x.foo() + x.notHere(),
    bar: b.foo(1).notHere()
};
b.foo(new class extends A {
    bar() {
        return '';
    }
}());
