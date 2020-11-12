function a() {
}
function foo() {
}
const a1 = a, foo1 = foo, a2 = a1, foo2 = foo1;
console.log(a2(), foo2());
