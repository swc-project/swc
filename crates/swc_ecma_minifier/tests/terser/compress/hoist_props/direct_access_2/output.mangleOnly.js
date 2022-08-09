var r = {
    a: 1
};
var a = function(a) {
    if (r[a]) return "PASS";
};
console.log(a("a"));
