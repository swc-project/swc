function d(a) {
    return a.count++;
}
function a() {
    var b = arguments[0];
    var c = d(b);
    return (a.amount = b.count), c;
}
var b = {
    count: 0
};
var c = a(b);
console.log(a.amount, c);
