// basic uses of specialized signatures without errors
class Base {
}
class Derived1 extends Base {
}
class Derived2 extends Base {
}
class C {
    foo(x) {
        return x;
    }
}
var c = new C();
var i;
var a;
c = i;
c = a;
i = c;
i = a;
a = c;
a = i;
var r1 = c.foo('hi');
var r2 = c.foo('bye');
var r3 = c.foo('hm');
