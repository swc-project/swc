// Optional parameters should be valid in all the below casts
function foo(x) {}
foo(1);
foo();
function foo2(x, y) {}
foo2(1);
foo2(1, 2);
class C {
    foo(x) {}
    foo2(x, y) {}
}
var c;
c.foo();
c.foo(1);
c.foo2(1);
c.foo2(1, 2);
var i;
i();
i(1);
i(1, 2);
i.foo(1);
i.foo(1, 2);
i.foo(1, 2, 3);
var a;
a();
a(1);
a(1, 2);
a.foo(1);
a.foo(1, 2);
a.foo(1, 2, 3);
