// undefined is a subtype of every other types, no errors expected below
class Base {
}
class D0 extends Base {
}
class DA extends Base {
}
class D1 extends Base {
}
class D1A extends Base {
}
class D2 extends Base {
}
class D2A extends Base {
}
class D3 extends Base {
}
class D3A extends Base {
}
class D4 extends Base {
}
class D5 extends Base {
}
class D6 extends Base {
}
class D7 extends Base {
}
class D8 extends Base {
}
class D9 extends Base {
}
class D10 extends Base {
}
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
class D11 extends Base {
}
function f() {}
(function(f) {
    var bar = f.bar = 1;
})(f || (f = {}));
class D12 extends Base {
}
class c {
}
(function(c) {
    var bar = c.bar = 1;
})(c || (c = {}));
class D13 extends Base {
}
class D14 extends Base {
}
class D15 extends Base {
}
//class D15<T, U extends T> extends Base {
//    foo: U;
//}
class D16 extends Base {
}
class D17 extends Base {
}
