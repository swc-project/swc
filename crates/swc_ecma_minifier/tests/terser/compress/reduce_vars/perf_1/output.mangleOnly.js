function a(a, b, c) {
    return a < b ? a * b + c : a * c - b;
}
function b(b, c, d) {
    return a(b, c, d);
}
var c = 0;
for(var d = 0; d < 100; ++d){
    c += b(d, d + 1, 3 * d);
}
console.log(c);
