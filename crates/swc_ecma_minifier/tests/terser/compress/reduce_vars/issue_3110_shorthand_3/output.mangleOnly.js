(function() {
    function o() {
        return n ? "foo" : "bar";
    }
    console.log(o());
    var n = true;
    var r = {
        foo: o
    };
    console.log(r.foo());
})();
