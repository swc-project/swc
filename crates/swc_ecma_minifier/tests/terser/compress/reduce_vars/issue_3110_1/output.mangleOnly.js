(function() {
    function a() {
        return c ? "foo" : "bar";
    }
    var c = true;
    var b = {
        foo: a
    };
    console.log(a());
    console.log(b.foo());
})();
