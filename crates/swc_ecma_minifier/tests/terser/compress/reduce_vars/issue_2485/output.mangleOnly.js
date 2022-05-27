var a = function(a) {
    var b = function(a, b) {
        return a + b;
    };
    var c = function(a) {
        return a.reduce(b, 0);
    };
    var d = function(a) {
        return c(a);
    };
    a.baz = function(b) {
        var a = d(b);
        return (a.get = 1), a;
    };
    return a;
};
var b = a({});
console.log(b.baz([
    1,
    2,
    3
]));
