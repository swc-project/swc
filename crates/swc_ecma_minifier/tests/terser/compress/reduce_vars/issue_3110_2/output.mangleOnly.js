(function () {
    function o() {
        return n ? "foo" : "bar";
    }
    var n = true;
    console.log(o());
    var r = { foo: o };
    console.log(r.foo());
})();
