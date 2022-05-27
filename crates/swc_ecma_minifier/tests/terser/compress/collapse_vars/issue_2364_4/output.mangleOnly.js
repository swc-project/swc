function d(a) {
    return a.count++;
}
function a(b, c) {
    var e = d(b);
    return (a.amount = c.count), e;
}
var b = {
    count: 0
};
var c = a(b, b);
console.log(a.amount, c);
