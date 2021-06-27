function foo() {
    var o = 42;
    with (o) {
        var foo = "something";
    }
    doSomething(o);
}
function bar() {
    var unused = 42;
    return something();
}
