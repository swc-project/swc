export var foo;
export function init() {
    function bar() {
        foo = bar, console.log(111);
    }
    return bar;
}
function bar() {
    foo = bar, console.log(111);
}
export function init1() {
    return bar;
}
