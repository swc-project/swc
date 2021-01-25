function a() {
}
const a1 = a;
function foo() {
}
const foo1 = foo;
function foo2() {
}
console.log(foo2(), a1(), foo1());
