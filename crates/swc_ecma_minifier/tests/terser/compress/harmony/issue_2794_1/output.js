function foo() {
    for (const a of doSomething(value)) console.log(a);
}
function doSomething(x) {
    return [x, 2 * x, 3 * x];
}
const value = 10;
foo();
