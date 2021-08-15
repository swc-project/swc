const a1 = foo1();
function foo1() {
    return 1;
}
const b1 = foo2();
function foo2() {
    return 2;
}
export { a1 as a, b1 as b };
