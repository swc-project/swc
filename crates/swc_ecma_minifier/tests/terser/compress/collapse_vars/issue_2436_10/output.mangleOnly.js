var a = {
    a: 1,
    b: 2
};
function b(b) {
    a = {
        b: 3
    };
    return b;
}
console.log((function(a) {
    return [
        a.a,
        b(a.b),
        a.b
    ];
})(a).join(" "));
