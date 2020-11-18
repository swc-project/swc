function foo() {
    return 1;
}
function foo1() {
    return 2;
}
export { a2 as a, b2 as b };
const a = foo();
const a1 = a;
const a2 = a1;
const b = foo1();
const b1 = b;
const b2 = b1;
