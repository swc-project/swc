class C {
    f() {
        var x;
        var a = x['toString'](); // should be string
        return a + x.toString();
    }
}
var r = new C().f();
var i;
var r2 = i.foo.toString();
var r2b = i.foo['toString']();
var a;
var r3 = a().toString();
var r3b = a()['toString']();
var b = {
    foo: (x)=>{
        var a = x['toString'](); // should be string
        return a + x.toString();
    }
};
var r4 = b.foo(1);
