(function () {
    function foo() {
        return isDev ? "foo" : "bar";
    }
    console.log(foo());
    var isDev = true;
    var obj = { foo: foo };
    console.log(obj.foo());
})();
