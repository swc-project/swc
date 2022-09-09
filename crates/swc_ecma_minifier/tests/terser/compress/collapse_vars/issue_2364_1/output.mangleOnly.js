function n(n) {
    return n.count++;
}
function o() {
    var t = arguments[0];
    var u = n(t);
    return (o.amount = t.count), u;
}
var t = { count: 0 };
var u = o(t);
console.log(o.amount, u);
