export var foo;
export function init() {
    return function bar() {
        foo = bar, console.log(111);
    };
}
function bar() {
    foo = bar, console.log(111);
}
export function init1() {
    return bar;
}
