(function() {
    function o() {
        return r ? "foo" : "bar";
    }
    var r = true;
    var n = {
        foo: o
    };
    console.log(o());
    console.log(n.foo());
})();
