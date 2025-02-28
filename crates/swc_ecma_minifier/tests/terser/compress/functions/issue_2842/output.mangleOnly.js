(function() {
    function o(n) {
        return n[n[0]];
    }
    function n() {
        if (true) {
            const n = o([
                1,
                2,
                3
            ]);
            console.log(n);
        }
    }
    return n();
})();
