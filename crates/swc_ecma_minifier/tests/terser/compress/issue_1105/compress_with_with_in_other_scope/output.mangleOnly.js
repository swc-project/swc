function foo() {
    var o = 42;
    with (o){
        var foo = "something";
    }
    doSomething(o);
}
function bar() {
    var a = 42;
    return something();
}
