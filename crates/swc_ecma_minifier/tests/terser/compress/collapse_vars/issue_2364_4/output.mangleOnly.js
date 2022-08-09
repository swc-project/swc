function n(n) {
    return n.count++;
}
function t(u, o) {
    var r = n(u);
    return (t.amount = o.count), r;
}
var u = {
    count: 0
};
var o = t(u, u);
console.log(t.amount, o);
