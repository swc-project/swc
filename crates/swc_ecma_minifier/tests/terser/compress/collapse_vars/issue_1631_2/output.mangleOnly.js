var r = 0, o = 1;
function t() {
    r = 2;
    return 4;
}
function n() {
    var n = t();
    o = r + n;
    return o;
}
console.log(n());
