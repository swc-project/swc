console.log((function() {
    var n = {
        p: 1
    }, o = [
        n
    ];
    console.log(o[0].p);
    return n.p;
})());
