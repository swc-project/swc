function outer() {
    var o = {};
    function foo() {
        function not_in_use() {
            return 24;
        }
        var unused = {};
        with (o) var foo = "something";
        doSomething(o);
    }
    function bar() {
        doSomethingElse();
    }
    foo();
    bar();
}
