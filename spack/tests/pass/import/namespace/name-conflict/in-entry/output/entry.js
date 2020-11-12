function a() {
}
function foo() {
}
const a1 = a, foo1 = foo, a2 = a1, foo2 = foo1;
function foo3() {
}
console.log(foo3(), a2(), foo2());
