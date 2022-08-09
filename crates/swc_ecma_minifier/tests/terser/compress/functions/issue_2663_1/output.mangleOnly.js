(function() {
    var n, o = {};
    function f(n) {
        return function() {
            console.log(n);
        };
    }
    for(n in {
        a: 1,
        b: 2,
        c: 3
    })o[n] = f(n);
    for(n in o)o[n]();
})();
