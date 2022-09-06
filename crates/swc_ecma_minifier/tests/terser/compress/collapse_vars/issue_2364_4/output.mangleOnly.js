function n(n) {
    return n.count++;
}
function o(t, u) {
    var r = n(t);
    return (o.amount = u.count), r;
}
var t = { count: 0 };
var u = o(t, t);
console.log(o.amount, u);
