var o = function (o) {
    console.log("async", o);
};
var n = function (o) {
    console.log("await", o);
};
o(1);
n(2);
