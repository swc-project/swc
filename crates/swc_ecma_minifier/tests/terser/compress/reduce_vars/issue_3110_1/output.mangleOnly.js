(function() {
    function o() {
        return r ? "foo" : "bar";
    }
    var r = true;
    var f = {
        foo: o
    };
    console.log(o());
    console.log(f.foo());
})();
