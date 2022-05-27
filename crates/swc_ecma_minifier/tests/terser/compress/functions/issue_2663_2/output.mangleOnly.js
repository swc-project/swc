(function() {
    var a;
    function b(a) {
        return (function() {
            console.log(a);
        })();
    }
    for(a in {
        a: 1,
        b: 2,
        c: 3
    })b(a);
})();
