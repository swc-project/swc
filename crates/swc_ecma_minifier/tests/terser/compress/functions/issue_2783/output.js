(function() {
    return function(o, i) {
        while(i--)console.log(f(o));
    };
    function f(a) {
        return a.b || a;
    }
})()({
    b: "PASS"
}, 1);
