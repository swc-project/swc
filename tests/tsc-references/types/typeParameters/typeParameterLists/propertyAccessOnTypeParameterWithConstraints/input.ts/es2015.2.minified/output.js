var i, a;
new class {
    f() {
        var x;
        return x.getDate() + x.getDate();
    }
}().f(), i.foo.getDate(), i.foo.getDate(), a().getDate(), a().getDate(), ({
    foo: (x)=>x.getDate() + x.getDate()
}).foo(new Date());
