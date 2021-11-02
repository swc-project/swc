function f1() {
    throw a1 = x1();
}
function f2(a) {
    throw x1();
}
function f3() {
    throw x1();
}
function f4() {
    try {
        throw a1 = x1();
    } catch (b) {
        console.log(a1);
    }
}
function f5(a) {
    try {
        throw a = x1();
    } catch (b) {
        console.log(a);
    }
}
function f6() {
    var a;
    try {
        throw a = x1();
    } catch (b) {
        console.log(a);
    }
}
function f7() {
    try {
        throw a1 = x1();
    } finally{
        console.log(a1);
    }
}
function f8(a) {
    try {
        throw a = x1();
    } finally{
        console.log(a);
    }
}
function f9() {
    var a;
    try {
        throw a = x1();
    } finally{
        console.log(a);
    }
}
function test(inc) {
    var counter = 0;
    x1 = function() {
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
        a1 = null;
        try {
            f(10 * (1 + i));
        } catch (x) {
            console.log("caught " + x);
        }
        if (null !== a1) console.log("a: " + a1);
    });
}
var x1, a1;
test(1);
test(-1);
