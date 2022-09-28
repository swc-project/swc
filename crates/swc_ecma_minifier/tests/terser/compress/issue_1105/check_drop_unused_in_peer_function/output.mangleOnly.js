function outer() {
    var o = {};
    var unused = {};
    function foo() {
        function not_in_use() {
            var n = "foo";
            return 24;
        }
        var unused = {};
        with (o){
            var foo = "something";
        }
        doSomething(o);
    }
    function bar() {
        var n = {};
        doSomethingElse();
    }
    foo();
    bar();
}
