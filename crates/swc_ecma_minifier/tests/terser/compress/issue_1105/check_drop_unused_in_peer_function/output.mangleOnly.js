function outer() {
    var o = {};
    var unused = {};
    function foo() {
        function not_in_use() {
            var o = "foo";
            return 24;
        }
        var unused = {};
        with (o) {
            var foo = "something";
        }
        doSomething(o);
    }
    function bar() {
        var o = {};
        doSomethingElse();
    }
    foo();
    bar();
}
