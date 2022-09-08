function foo() {
    var o = 42;
    with (o){
        var foo = "something";
    }
    doSomething(o);
}
function bar() {
    var n = 42;
    return something();
}
