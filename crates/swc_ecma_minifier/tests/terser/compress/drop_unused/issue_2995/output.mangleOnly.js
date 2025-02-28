function n(n) {
    var c;
    n.b = c = function() {};
    c.c = "PASS";
}
var c = {};
n(c);
console.log(c.b.c);
