(function () {
    function f(o, { a: x } = o) {
        console.log(x);
    }
    f({ a: "PASS" });
})();
