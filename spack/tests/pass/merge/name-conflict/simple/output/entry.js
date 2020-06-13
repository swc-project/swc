const a = foo();
function foo() {
    return 1;
}
const b = foo();
function foo() {
    return 2;
}
export { a, b };
