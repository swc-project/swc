(function() {
    return b;
    function a(a) {
        var b = a.b;
        if (b) return b;
        return a;
    }
    function b(b, c) {
        while(c--){
            console.log(a(b));
        }
    }
})()({
    b: "PASS"
}, 1);
