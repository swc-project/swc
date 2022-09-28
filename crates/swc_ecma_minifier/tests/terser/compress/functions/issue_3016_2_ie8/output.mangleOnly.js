var o = 1;
do {
    (function(r) {
        return r[o];
        try {
            r = 2;
        } catch (c) {
            var c;
        }
    })(3);
}while (0)
console.log(o);
