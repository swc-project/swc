console.log((function() {
    var a = {
        p: 1
    };
    console.log(a.not_present);
    return a.p;
})());
console.log((function() {
    var a = {
        p: 2
    };
    console.log(a.prototype);
    return a.p;
})());
console.log((function() {
    var a = {
        p: 3
    };
    console.log(a.hasOwnProperty);
    return a.p;
})());
