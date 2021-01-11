const a = foo1();
function foo1() {
    return 1;
}
const a1 = a;
const a2 = a1;
const a3 = a2;
const b = foo2();
function foo2() {
    return 2;
}
const b1 = b;
const b2 = b1;
const b3 = b2;
export { a2 as a, b2 as b };
