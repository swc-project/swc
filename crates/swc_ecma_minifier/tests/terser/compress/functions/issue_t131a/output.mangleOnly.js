(function() {
    function t() {
        return {
            a: 1
        };
    }
    function n() {
        return t();
    }
    function r() {
        var n = t();
        n.a = 2;
        n.b = 3;
        return n;
    }
    console.log(JSON.stringify(n()), JSON.stringify(r()));
})();
