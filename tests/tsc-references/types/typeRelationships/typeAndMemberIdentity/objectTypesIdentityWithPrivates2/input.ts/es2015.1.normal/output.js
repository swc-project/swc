// object types are identical structurally
class C {
}
class D extends C {
}
function foo1(x) {
}
function foo2(x) {
}
function foo3(x) {
}
function foo4(x) {
}
var r = foo4(new C());
var r = foo4(new D());
function foo5(x) {
}
function foo6(x) {
}
