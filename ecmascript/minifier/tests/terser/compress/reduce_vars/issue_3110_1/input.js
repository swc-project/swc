(function () {
    function foo() {
        return isDev ? "foo" : "bar";
    }
    var isDev = true;
    var obj = { foo: foo };
    console.log(foo());
    console.log(obj.foo());
})();
