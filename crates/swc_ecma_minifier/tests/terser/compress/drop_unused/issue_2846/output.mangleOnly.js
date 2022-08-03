function r(r, n) {
    var r = 0;
    n && n(r);
    return r++;
}
var n = r();
console.log(n);
