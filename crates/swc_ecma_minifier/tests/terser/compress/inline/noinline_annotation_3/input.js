(function () {
    function foo(val) {
        return val;
    }
    function bar() {
        var pass = 1;
        pass = /*@__NOINLINE__*/ foo(pass);
        window.data = pass;
    }
    window.bar = bar;
    bar();
})();
