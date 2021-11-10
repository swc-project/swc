var b = 1;
do {
    (function (a) {
        return a[b];
        try {
            a = 2;
        } catch (a) {
            var a;
        }
    })(3);
} while (0);
console.log(b);
