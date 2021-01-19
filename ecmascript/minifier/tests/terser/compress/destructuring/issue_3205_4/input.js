(function () {
    function f(o) {
        var { a: x } = o;
        console.log(x);
    }
    f({ a: "PASS" });
})();
