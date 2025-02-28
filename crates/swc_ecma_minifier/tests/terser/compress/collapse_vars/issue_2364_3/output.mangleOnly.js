function u(n) {
    return n.count++;
}
function n(o) {
    var t = u(o);
    return (n.amount = o.count), t;
}
var o = {
    count: 0
};
var t = n(o);
console.log(n.amount, t);
