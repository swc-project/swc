(function() {
    function n() {
        return {
            a: 1
        };
    }
    function r() {
        return n();
    }
    function t() {
        var r = n();
        r.a = 2;
        r.b = 3;
        return r;
    }
    console.log(JSON.stringify(r()), JSON.stringify(t()));
})();
