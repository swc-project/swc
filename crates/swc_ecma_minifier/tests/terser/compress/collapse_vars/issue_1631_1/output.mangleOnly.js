var r = 0;
function o(n) {
    r = 200;
    return 100;
}
function n() {
    var n = o();
    r += n;
    return r;
}
console.log(n());
