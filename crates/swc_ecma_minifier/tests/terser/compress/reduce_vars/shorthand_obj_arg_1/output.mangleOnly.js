var n = 1;
var r = function() {
    return n + n;
};
function o(n) {
    return n.bar();
}
console.log(o({
    bar: r
}));
