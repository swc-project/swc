function foo() {
    for (const a of func(value)) {
        console.log(a);
    }
    function func(va) {
        return doSomething(va);
    }
}
function doSomething(x) {
    return [x, 2 * x, 3 * x];
}
const value = 10;
foo();
