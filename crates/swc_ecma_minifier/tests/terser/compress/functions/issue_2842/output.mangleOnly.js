(function () {
    function n(n) {
        return n[n[0]];
    }
    function o() {
        if (true) {
            const o = n([1, 2, 3]);
            console.log(o);
        }
    }
    return o();
})();
