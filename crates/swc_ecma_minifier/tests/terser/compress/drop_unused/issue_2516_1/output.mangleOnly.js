function n() {
    function n(n) {
        l.call(null, n);
    }
    function l(n) {
        var a = 4;
        var l = n || never_called();
        var c = (a - 1) * l;
        console.log(c == 6 ? "PASS" : c);
    }
    a = n;
}
var a;
n();
a(2);
