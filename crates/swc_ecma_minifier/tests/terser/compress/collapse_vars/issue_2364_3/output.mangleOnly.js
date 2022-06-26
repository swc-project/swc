function a(a) {
    return a.count++;
}
function b(c) {
    var d = a(c);
    return (b.amount = c.count), d;
}
var c = {
    count: 0
};
var d = b(c);
console.log(b.amount, d);
