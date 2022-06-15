function a(a) {
    var b;
    a.b = b = function() {};
    b.c = "PASS";
}
var b = {};
a(b);
console.log(b.b.c);
