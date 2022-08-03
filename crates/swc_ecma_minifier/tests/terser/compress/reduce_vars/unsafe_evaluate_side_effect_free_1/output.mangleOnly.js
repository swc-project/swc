console.log((function() {
    var n = {
        p: 1
    };
    console.log(n.p);
    return n.p;
})());
console.log((function() {
    var n = {
        p: 2
    };
    console.log(n.p);
    return n;
})());
console.log((function() {
    var n = {
        p: 3
    };
    console.log([
        n
    ][0].p);
    return n.p;
})());
