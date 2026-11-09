// A declaration that the later `x += x` does not use must not stop the
// sequence merger from reaching the pairs after it.
function f(p) {
    var x = p.q;
    sink(p.r, (x += x) + 1);
}
f({});
