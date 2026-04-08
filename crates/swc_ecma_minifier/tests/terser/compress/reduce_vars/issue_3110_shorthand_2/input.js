(function () {
    function foo() {
        return isDev ? "foo" : "bar";
    }
    var isDev = true;
    console.log(foo());
    var obj = { foo };
    console.log(obj.foo());
})();
