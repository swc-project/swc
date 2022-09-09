var o = 1;
do {
    (function (n) {
        return n[o];
        var n;
    })(3);
} while (0);
console.log(o);
