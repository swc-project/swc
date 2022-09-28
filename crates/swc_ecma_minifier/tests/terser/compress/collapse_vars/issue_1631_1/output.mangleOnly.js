var n = 0;
function r(r) {
    n = 200;
    return 100;
}
function o() {
    var o = r();
    n += o;
    return n;
}
console.log(o());
