var n = 0,
    r = 1;
function o() {
    n = 2;
    return 4;
}
function t() {
    var t = o();
    r = n + t;
    return r;
}
console.log(t());
