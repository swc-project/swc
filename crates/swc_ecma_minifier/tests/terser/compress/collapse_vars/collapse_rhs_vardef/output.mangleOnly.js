var o,
    n = 1;
o =
    --n +
    (function o() {
        var n;
        o[--n] = 1;
    })();
n |= o;
console.log(o, n);
