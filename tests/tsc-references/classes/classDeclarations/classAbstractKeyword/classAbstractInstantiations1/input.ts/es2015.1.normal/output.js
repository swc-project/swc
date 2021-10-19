//
// Calling new with (non)abstract classes.
//
class A {
}
class B extends A {
}
class C extends B {
}
new A;
new A(1); // should report 1 error
new B;
new C;
var a;
var b;
var c;
a = new B;
b = new B;
c = new B;
