var b = 1;
do {
    (function (a) {
        return a[b];
        var a;
    })(3);
} while (0);
console.log(b);
