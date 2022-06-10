(function() {
    function a() {
        return c ? "foo" : "bar";
    }
    var c = true;
    console.log(a());
    var b = {
        foo: a
    };
    console.log(b.foo());
})();
