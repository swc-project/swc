var b = {
    a: 1
};
var a = function(a) {
    if (b[a]) return "PASS";
};
console.log(a("a"));
