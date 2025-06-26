function foo() {
    var o = 42;
    with (o);
    doSomething(o);
}
