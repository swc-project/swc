function foo() {
    var o = 42;
    with (o) {
        var foo = "something";
    }
    doSomething(o);
}
