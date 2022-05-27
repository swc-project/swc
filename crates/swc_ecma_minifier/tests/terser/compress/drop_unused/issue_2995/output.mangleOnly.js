function b(b) {
    var a;
    b.b = a = function() {};
    a.c = "PASS";
}
var a = {};
b(a);
console.log(a.b.c);
