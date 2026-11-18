(function() {
    function o() {
        return n ? "foo" : "bar";
    }
    var n = true;
    var r = {
        foo: o
    };
    console.log(o());
    console.log(r.foo());
})();
