(function () {
    function f() {
        var o = { a: "PASS" },
            { a: x } = o;
        console.log(x);
    }
    f();
})();
