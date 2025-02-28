(function() {
    function o() {
        return r ? "foo" : "bar";
    }
    var r = true;
    console.log(o());
    var n = {
        foo: o
    };
    console.log(n.foo());
})();
