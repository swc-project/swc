console.log((function() {
    var a = {
        p: 1
    };
    console.log(a.p);
    return a.p;
})());
console.log((function() {
    var a = {
        p: 2
    };
    console.log(a.p);
    return a;
})());
console.log((function() {
    var a = {
        p: 3
    };
    console.log([
        a
    ][0].p);
    return a.p;
})());
