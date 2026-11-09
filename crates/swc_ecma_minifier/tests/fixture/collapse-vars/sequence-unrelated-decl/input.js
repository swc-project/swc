// A declaration that the later `x += x` does not use must not stop the
// sequence merger from reaching the pairs after it.
function f(p) {
    var x = p.q;
    var a = p.r;
    x += x;
    var c = x + 1;
    sink(a, c);
}

f({});
