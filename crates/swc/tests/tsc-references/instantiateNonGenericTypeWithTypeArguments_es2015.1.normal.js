// it is an error to provide type arguments to a non-generic call
// all of these are errors
class C {
}
var c = new C();
function Foo() {
}
var r = new Foo();
var f;
var r2 = new f();
var a;
// BUG 790977
var r2 = new a();
