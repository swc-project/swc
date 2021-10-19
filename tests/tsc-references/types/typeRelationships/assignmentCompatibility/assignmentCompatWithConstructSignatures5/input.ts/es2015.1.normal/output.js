// checking assignment compat for function types. All valid
class Base {
}
class Derived extends Base {
}
class Derived2 extends Derived {
}
class OtherDerived extends Base {
}
var a;
var a2;
var a3;
var a4;
var a5;
var a6;
var a11;
var a15;
var a16;
var a17;
var a18;
var b;
a = b; // ok
b = a; // ok
var b2;
a2 = b2; // ok
b2 = a2; // ok
var b3;
a3 = b3; // ok
b3 = a3; // ok
var b4;
a4 = b4; // ok
b4 = a4; // ok
var b5;
a5 = b5; // ok
b5 = a5; // ok
var b6;
a6 = b6; // ok
b6 = a6; // ok
var b11;
a11 = b11; // ok
b11 = a11; // ok
var b15;
a15 = b15; // ok
b15 = a15; // ok
var b16;
a15 = b16; // ok
b15 = a16; // ok
var b17;
a17 = b17; // ok
b17 = a17; // ok
var b18;
a18 = b18; // ok
b18 = a18; // ok
