(function() {
    function a() {
        return b ? "foo" : "bar";
    }
    var b = true;
    var c = {
        foo: a
    };
    console.log(a());
    console.log(c.foo());
})();
