function foo() {
    return 1;
}
function foo1() {
    return 2;
}
const a3 = foo();
const a1 = a3;
const a2 = a1;
const b3 = foo1();
const b1 = b3;
const b2 = b1;
export { a2 as a, b2 as b };
