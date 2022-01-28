function outer() {
    var o = {};
    var unused = {};
    function foo() {
        function not_in_use() {
            var nested_unused = "foo";
            return 24;
        }
        var unused = {};
        with (o) {
            var foo = "something";
        }
        doSomething(o);
    }
    function bar() {
        var unused = {};
        doSomethingElse();
    }
    foo();
    bar();
}
