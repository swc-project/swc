// Generic call with constraints infering type parameter from object member properties
// No errors expected
class C {
}
class D {
}
class X {
}
var Class;
(function(Class) {
    class G {
        foo(t, t2) {
            var x;
            return x;
        }
    }
    var c1 = new X();
    var d1 = new X();
    var g;
    var r = g.foo(c1, d1);
    var r2 = g.foo(c1, c1);
    class G2 {
        foo2(t1, t21) {
            var x;
            return x;
        }
    }
    var g2;
    var r = g2.foo2(c1, d1);
    var r2 = g2.foo2(c1, c1);
})(Class || (Class = {
}));
var Interface;
(function(Interface) {
    var c1 = new X();
    var d1 = new X();
    var g;
    var r = g.foo(c1, d1);
    var r2 = g.foo(c1, c1);
    var g2;
    var r = g2.foo2(c1, d1);
    var r2 = g2.foo2(c1, c1);
})(Interface || (Interface = {
}));
