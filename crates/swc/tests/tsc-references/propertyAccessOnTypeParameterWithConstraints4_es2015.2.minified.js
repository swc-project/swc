new class {
    f() {
        var x;
        return x.notHere() + x.notHere();
    }
}().f(), i.foo.notHere(), i.foo.notHere(), a().notHere(), a().notHere();
var i, a, b = {
    foo: (x)=>x.notHere() + x.notHere(),
    bar: b.foo().notHere()
};
b.foo(new Date());
