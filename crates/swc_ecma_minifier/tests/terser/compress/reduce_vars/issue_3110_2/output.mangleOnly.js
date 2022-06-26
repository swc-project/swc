(function() {
    function a() {
        return b ? "foo" : "bar";
    }
    var b = true;
    console.log(a());
    var c = {
        foo: a
    };
    console.log(c.foo());
})();
