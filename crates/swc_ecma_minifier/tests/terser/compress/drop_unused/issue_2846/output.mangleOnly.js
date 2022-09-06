function n(n, o) {
    var n = 0;
    o && o(n);
    return n++;
}
var o = n();
console.log(o);
