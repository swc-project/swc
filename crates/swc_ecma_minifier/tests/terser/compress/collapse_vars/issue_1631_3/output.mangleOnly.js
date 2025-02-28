function n() {
    var r = 0, n = 1;
    function o() {
        r = 2;
        return 4;
    }
    var t = o();
    n = r + t;
    return n;
}
console.log(n());
