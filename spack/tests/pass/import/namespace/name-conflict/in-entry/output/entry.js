function a() {
}
function foo() {
}
const a1 = a;
const foo1 = foo;
function foo2() {
}
console.log(foo2(), a1(), foo1());
