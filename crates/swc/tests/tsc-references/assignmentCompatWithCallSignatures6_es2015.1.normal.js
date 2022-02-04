// checking assignment compatibility relations for function types. All valid
class Base {
}
class Derived extends Base {
}
class Derived2 extends Derived {
}
class OtherDerived extends Base {
}
var x;
var b;
x.a = b;
b = x.a;
var b2;
x.a2 = b2;
b2 = x.a2;
var b3;
x.a3 = b3;
b3 = x.a3;
var b4;
x.a4 = b4;
b4 = x.a4;
var b5;
x.a5 = b5;
b5 = x.a5;
var b11;
x.a11 = b11;
b11 = x.a11;
var b16;
x.a16 = b16;
b16 = x.a16;
