var a = {
    a: 1,
    b: 2
};
console.log((function(a) {
    a = {
        a: 3,
        b: 4
    };
    return {
        x: a.a,
        y: a.b
    };
})(a));
