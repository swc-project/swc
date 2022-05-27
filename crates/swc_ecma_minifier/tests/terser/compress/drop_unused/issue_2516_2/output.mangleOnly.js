function a() {
    function a(a) {
        c.call(null, a);
    }
    function c(b) {
        var c = 4;
        var d = b || never_called();
        var a = (c - 1) * d;
        console.log(a == 6 ? "PASS" : a);
    }
    b = a;
}
var b;
a();
b(2);
