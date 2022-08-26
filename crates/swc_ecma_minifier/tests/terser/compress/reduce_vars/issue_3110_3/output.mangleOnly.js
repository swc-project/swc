(function() {
    function o() {
        return r ? "foo" : "bar";
    }
    console.log(o());
    var r = true;
    var f = {
        foo: o
    };
    console.log(f.foo());
})();
