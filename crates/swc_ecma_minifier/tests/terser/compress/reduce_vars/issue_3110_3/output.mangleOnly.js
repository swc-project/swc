(function() {
    function a() {
        return c ? "foo" : "bar";
    }
    console.log(a());
    var c = true;
    var b = {
        foo: a
    };
    console.log(b.foo());
})();
