function foo() {
    bar();
    baz();
}
function bar() {
    foo();
}
function baz() {
    foo();
}
export function use() {
    return bar();
}
