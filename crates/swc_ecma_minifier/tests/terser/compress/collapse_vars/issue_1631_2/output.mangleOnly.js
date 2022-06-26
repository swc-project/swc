var a = 0, b = 1;
function c() {
    a = 2;
    return 4;
}
function d() {
    var d = c();
    b = a + d;
    return b;
}
console.log(d());
