function foo() {
    for (const o of doSomething(value)) console.log(o);
}
function doSomething(o) {
    return [o, 2 * o, 3 * o];
}
const value = 10;
foo();
