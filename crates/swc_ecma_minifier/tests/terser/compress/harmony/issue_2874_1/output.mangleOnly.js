(function () {
    function n() {
        let n = ["A", "B", "C"];
        let o = [2, 1, 0].map((o) => t(n[o] + o));
        return o;
    }
    function t(n) {
        return () => console.log(n);
    }
    n().map((n) => n());
})();
