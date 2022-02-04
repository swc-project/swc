function foo(x) {}
var c, i, a, f = function(x) {}, f2 = (x, y)=>{};
foo(1), foo(), f(1), f(), f2(1), f2(1, 2), c.foo(), c.foo(1), i(), i(1), i.foo(1), i.foo(1, 2), a(), a(1), a.foo(), a.foo(1);
var b = {
    foo (x) {},
    a: function(x, y) {},
    b: (x)=>{}
};
b.foo(), b.foo(1), b.a(1), b.a(1, 2), b.b(), b.b(1);
