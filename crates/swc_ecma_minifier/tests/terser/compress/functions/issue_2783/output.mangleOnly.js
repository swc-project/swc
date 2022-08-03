(function() {
    return r;
    function n(n) {
        var r = n.b;
        if (r) return r;
        return n;
    }
    function r(r, t) {
        while(t--){
            console.log(n(r));
        }
    }
})()({
    b: "PASS"
}, 1);
