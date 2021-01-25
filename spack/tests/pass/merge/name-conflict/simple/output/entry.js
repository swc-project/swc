const a3 = foo1();
const a1 = a3;
const a2 = a1;
function foo1() {
    return 1;
}
const b3 = foo2();
const b1 = b3;
const b2 = b1;
function foo2() {
    return 2;
}
export { a2 as a, b2 as b };
