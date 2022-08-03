(function() {
    function n(n) {
        return n[n[0]];
    }
    function t() {
        if (true) {
            const t = n([
                1,
                2,
                3
            ]);
            console.log(t);
        }
    }
    return t();
})();
