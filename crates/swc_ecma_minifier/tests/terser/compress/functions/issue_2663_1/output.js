(function() {
    var i, o = {};
    for(i in {
        a: 1,
        b: 2,
        c: 3
    })o[i] = function(j) {
        return function() {
            console.log(j);
        };
    }(i);
    for(i in o)o[i]();
})();
