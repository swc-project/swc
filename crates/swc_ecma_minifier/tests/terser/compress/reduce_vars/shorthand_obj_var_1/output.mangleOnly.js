var r = 1;
var a = function() {
    return r + r;
};
var n = {
    bar: a
};
console.log(n.bar());
