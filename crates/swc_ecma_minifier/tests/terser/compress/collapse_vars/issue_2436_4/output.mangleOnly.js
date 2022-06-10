var a = {
    a: 1,
    b: 2
};
console.log((function(a) {
    return {
        x: a.a,
        y: a.b
    };
    var b;
})(a));
