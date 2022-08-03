var r = 1;
do {
    (function(t) {
        return t[r];
        try {
            t = 2;
        } catch (a) {
            var a;
        }
    })(3);
}while (0)
console.log(r);
