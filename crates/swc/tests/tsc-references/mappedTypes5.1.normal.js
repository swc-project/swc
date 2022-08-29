//// [mappedTypes5.ts]
function f(p, r, pr, rp) {
    var a1 = p;
    var a2 = r;
    var a3 = pr;
    var a4 = rp;
    var b1 = p; // Error
    var b2 = r;
    var b3 = pr; // Error
    var b4 = rp; // Error
    var c1 = p;
    var c2 = r;
    var c3 = pr;
    var c4 = rp;
    var d1 = p;
    var d2 = r;
    var d3 = pr;
    var d4 = rp;
}
function doit() {
    var previous = Object.create(null);
    var current = Object.create(null);
    var args1 = {
        previous: previous,
        current: current
    };
    var args2 = {
        previous: previous,
        current: current
    };
}
function doit2() {
    var previous = Object.create(null);
    var current = Object.create(null);
    var args1 = {
        previous: previous,
        current: current
    };
    var args2 = {
        previous: previous,
        current: current
    };
}
