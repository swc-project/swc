function n() {
    function n(n) {
        a.call(null, n);
    }
    function a(l) {
        var a = 4;
        var c = l || never_called();
        var n = (a - 1) * c;
        console.log(n == 6 ? "PASS" : n);
    }
    l = n;
}
var l;
n();
l(2);
