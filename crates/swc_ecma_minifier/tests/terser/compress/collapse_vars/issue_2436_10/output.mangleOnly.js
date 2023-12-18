var n = {
    a: 1,
    b: 2
};
function o(n) {
    n = {
        b: 3
    };
    return n;
}
console.log((function(n) {
    return [
        n.a,
        o(n.b),
        n.b
    ];
})(n).join(" "));
