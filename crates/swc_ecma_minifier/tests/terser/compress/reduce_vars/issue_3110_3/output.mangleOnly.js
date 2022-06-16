(function() {
    function a() {
        return b ? "foo" : "bar";
    }
    console.log(a());
    var b = true;
    var c = {
        foo: a
    };
    console.log(c.foo());
})();
