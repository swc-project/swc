const a2 = foo1();
function foo1() {
    return 1;
}
const a1 = a2;
const b2 = foo2();
function foo2() {
    return 2;
}
const b1 = b2;
export { a1 as a, b1 as b };
