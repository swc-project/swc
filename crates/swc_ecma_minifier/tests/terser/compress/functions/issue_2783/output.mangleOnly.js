(function() {
    return n;
    function r(n) {
        var r = n.b;
        if (r) return r;
        return n;
    }
    function n(o, n) {
        while(n--){
            console.log(r(o));
        }
    }
})()({
    b: "PASS"
}, 1);
