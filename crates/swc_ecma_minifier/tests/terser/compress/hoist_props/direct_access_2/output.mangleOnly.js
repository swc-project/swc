var a = {
    a: 1
};
var r = function(r) {
    if (a[r]) return "PASS";
};
console.log(r("a"));
