function n() {
    function n(n) {
        a.call(null, n);
    }
    function a(n) {
        var l = 4;
        var a = n || never_called();
        var c = (l - 1) * a;
        console.log(c == 6 ? "PASS" : c);
    }
    l = n;
}
var l;
n();
l(2);
