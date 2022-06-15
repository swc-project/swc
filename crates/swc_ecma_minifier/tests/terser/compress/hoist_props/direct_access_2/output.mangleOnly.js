var a = {
    a: 1
};
var b = function(b) {
    if (a[b]) return "PASS";
};
console.log(b("a"));
