function d(a, b, c) {
    return a < b ? a * b + c : a * c - b;
}
function c(a, b, c) {
    return d(a, b, c);
}
var b = 0;
for(var a = 0; a < 100; ++a){
    b += c(a, a + 1, 3 * a);
}
console.log(b);
