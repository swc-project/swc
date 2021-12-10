function f1() {
    throw a = x();
}
function f2(a) {
    throw x();
}
function f3() {
    throw x();
}
function f4() {
    try {
        throw a = x();
    } catch (b) {
        console.log(a);
    }
}
function f5(a1) {
    try {
        throw a1 = x();
    } catch (b) {
        console.log(a1);
    }
}
function f6() {
    var a2;
    try {
        throw a2 = x();
    } catch (b) {
        console.log(a2);
    }
}
function f7() {
    try {
        throw a = x();
    } finally{
        console.log(a);
    }
}
function f8(a3) {
    try {
        throw a3 = x();
    } finally{
        console.log(a3);
    }
}
function f9() {
    var a4;
    try {
        throw a4 = x();
    } finally{
        console.log(a4);
    }
}
function test(inc) {
    var counter = 0;
    x = function() {
        counter += inc;
        if (inc < 0) throw counter;
        return counter;
    };
    [
        f1,
        f2,
        f3,
        f4,
        f5,
        f6,
        f7,
        f8,
        f9
    ].forEach(function(f, i) {
        a = null;
        try {
            f(10 * (1 + i));
        } catch (x1) {
            console.log("caught " + x1);
        }
        if (null !== a) console.log("a: " + a);
    });
}
var x, a;
test(1);
test(-1);
