function f1(a, b, c) {
    return (a = x()), y(), a && c >> 5;
}
function f2() {
    return (e = x());
}
function f3(e) {
    return x();
}
function f4() {
    return x();
}
function f5(a) {
    try {
        return x();
    } catch (b) {
        console.log(a);
    }
}
function f6(a) {
    try {
        return (a = x());
    } finally {
        console.log(a);
    }
}
function y() {
    console.log("y");
}
function test(inc) {
    var counter = 0;
    x = function () {
        counter += inc;
        if (inc < 0) throw counter;
        return counter;
    };
    [f1, f2, f3, f4, f5, f6].forEach(function (f, i) {
        e = null;
        try {
            i += 1;
            console.log("result " + f(10 * i, 100 * i, 1e3 * i));
        } catch (x) {
            console.log("caught " + x);
        }
        if (null !== e) console.log("e: " + e);
    });
}
var x, e;
test(1);
test(-1);
