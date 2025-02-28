var n = {
    a: 1
};
var a = function(a) {
    if (n[a]) return "PASS";
};
console.log(a("a"));
