(function () {
    function foo() {
        return isDev ? "foo" : "bar";
    }
    console.log(foo());
    var isDev = true;
    var obj = { foo };
    console.log(obj.foo());
})();
