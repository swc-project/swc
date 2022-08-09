console.log((function() {
    var n = {
        p: 1
    };
    console.log(n, n.p);
    return n.p;
})());
console.log((function() {
    var n = {
        p: 2
    };
    console.log(n.p, n);
    return n.p;
})());
console.log((function() {
    var n = {
        p: 3
    }, o = [
        n
    ];
    console.log(o[0].p++);
    return n.p;
})());
