var foo;
function init() {
    return function bar() {
        foo = bar, console.log(111);
    };
}
function bar() {
    foo = bar, console.log(111);
}
function init1() {
    return bar;
}
export { foo, init, init1 };
