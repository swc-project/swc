(function() {
    var a, b = {};
    function c(a) {
        return function() {
            console.log(a);
        };
    }
    for(a in {
        a: 1,
        b: 2,
        c: 3
    })b[a] = c(a);
    for(a in b)b[a]();
})();
