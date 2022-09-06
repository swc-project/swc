function f() {
    var o = {};
    var unused = {};
    function foo() {
        with (o) {
            var foo = "something";
        }
        doSomething(o);
    }
    foo();
}
