function a() {
}
const a1 = a;
function foo() {
}
const foo1 = foo;
console.log(a1(), foo1());
