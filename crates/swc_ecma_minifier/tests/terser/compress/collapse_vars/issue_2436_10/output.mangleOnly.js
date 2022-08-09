var n = {
    a: 1,
    b: 2
};
function r(r) {
    n = {
        b: 3
    };
    return r;
}
console.log((function(n) {
    return [
        n.a,
        r(n.b),
        n.b
    ];
})(n).join(" "));
