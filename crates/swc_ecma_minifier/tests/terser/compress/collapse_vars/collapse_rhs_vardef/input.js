var a,
    b = 1;
a =
    --b +
    (function c() {
        var b;
        c[--b] = 1;
    })();
b |= a;
console.log(a, b);
