function c(c) {
    var n;
    c.b = n = function() {};
    n.c = "PASS";
}
var n = {};
c(n);
console.log(n.b.c);
