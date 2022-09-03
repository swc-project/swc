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
bar();
