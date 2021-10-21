const a = foo();
function foo() {
    return 1;
}
const b = foo1();
function foo1() {
    return 2;
}
export { a as a, b as b };
