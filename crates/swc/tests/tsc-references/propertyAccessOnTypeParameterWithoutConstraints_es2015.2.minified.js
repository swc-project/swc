var i, a;
new class {
    f() {
        var x;
        return x.toString() + x.toString();
    }
}().f(), i.foo.toString(), i.foo.toString(), a().toString(), a().toString(), ({
    foo: (x)=>x.toString() + x.toString()
}).foo(1);
