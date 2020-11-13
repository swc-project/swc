const a = foo1();
function foo1() {
    return 1;
}
const a1 = a, a2 = a1;
const b = foo2();
function foo2() {
    return 2;
}
const b1 = b, b2 = b1;
export { a2 as a, b2 as b };
