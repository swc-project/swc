function a(a) {
    return a.count++;
}
function b(c, d) {
    var e = a(c);
    return (b.amount = d.count), e;
}
var c = {
    count: 0
};
var d = b(c, c);
console.log(b.amount, d);
