function u(n) {
    return n.count++;
}
function n(o, t) {
    var r = u(o);
    return (n.amount = t.count), r;
}
var o = {
    count: 0
};
var t = n(o, o);
console.log(n.amount, t);
