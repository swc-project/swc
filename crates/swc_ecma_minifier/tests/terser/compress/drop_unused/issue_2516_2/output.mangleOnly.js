function a() {
    function a(a) {
        c.call(null, a);
    }
    function c(a) {
        var b = 4;
        var c = a || never_called();
        var d = (b - 1) * c;
        console.log(d == 6 ? "PASS" : d);
    }
    b = a;
}
var b;
a();
b(2);
