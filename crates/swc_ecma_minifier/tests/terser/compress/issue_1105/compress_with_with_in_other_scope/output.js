function foo() {
    var o = 42;
    with (o);
    doSomething(o);
}
function bar() {
    return something();
}
