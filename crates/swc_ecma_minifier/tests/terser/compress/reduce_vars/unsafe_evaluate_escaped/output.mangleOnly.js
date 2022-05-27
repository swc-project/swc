console.log((function() {
    var a = {
        p: 1
    };
    console.log(a, a.p);
    return a.p;
})());
console.log((function() {
    var a = {
        p: 2
    };
    console.log(a.p, a);
    return a.p;
})());
console.log((function() {
    var a = {
        p: 3
    }, b = [
        a
    ];
    console.log(b[0].p++);
    return a.p;
})());
