(function() {
    function o() {
        return r ? "foo" : "bar";
    }
    console.log(o());
    var r = true;
    var n = {
        foo: o
    };
    console.log(n.foo());
})();
