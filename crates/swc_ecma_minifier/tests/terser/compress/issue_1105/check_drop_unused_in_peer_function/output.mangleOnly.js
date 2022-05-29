function outer() {
    var o = {};
    var unused = {};
    function foo() {
        function not_in_use() {
            var a = "foo";
            return 24;
        }
        var unused = {};
        with (o){
            var foo = "something";
        }
        doSomething(o);
    }
    function bar() {
        var a = {};
        doSomethingElse();
    }
    foo();
    bar();
}
