(function() {
    function o() {
        return r ? "foo" : "bar";
    }
    var r = true;
    console.log(o());
    var f = {
        foo: o
    };
    console.log(f.foo());
})();
