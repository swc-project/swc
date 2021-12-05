class C {
    f() {
        var x;
        var a1 = x['notHere'](); // should be string
        return a1 + x.notHere();
    }
}
var r = new C().f();
var i;
var r2 = i.foo.notHere();
var r2b = i.foo['notHere']();
var a;
var r3 = a().notHere();
var r3b = a()['notHere']();
var b = {
    foo: (x)=>{
        var a2 = x['notHere'](); // should be string
        return a2 + x.notHere();
    },
    bar: b.foo().notHere()
};
var r4 = b.foo(new Date());
