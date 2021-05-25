var foo = function (bar) {
    var n = function (a, b) {
        return a + b;
    };
    var runSumAll = function (arg) {
        return (function (arg) {
            return arg.reduce(n, 0);
        })(arg);
    };
    bar.baz = function (arg) {
        var n = runSumAll(arg);
        return (n.get = 1), n;
    };
    return bar;
};
var bar = foo({});
console.log(bar.baz([1, 2, 3]));
