const a = foo1();
function foo1() {
    return 1;
}
const a1 = a;
const b = foo2();
function foo2() {
    return 2;
}
const b1 = b;
export { a1 as a, b1 as b };
