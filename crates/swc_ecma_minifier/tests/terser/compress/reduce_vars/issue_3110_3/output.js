(function() {
    function foo() {
        return isDev ? "foo" : "bar";
    }
    console.log(foo());
    var isDev = true;
    console.log(({
        foo: foo
    }).foo());
})();
