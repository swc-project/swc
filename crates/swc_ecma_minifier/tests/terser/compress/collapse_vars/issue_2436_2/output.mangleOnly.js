var a = {
    a: 1,
    b: 2
};
console.log((function(b) {
    a.a = 3;
    return {
        x: b.a,
        y: b.b
    };
})(a));
