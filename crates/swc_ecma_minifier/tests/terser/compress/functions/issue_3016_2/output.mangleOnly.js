var a = 1;
do {
    (function(b) {
        return b[a];
        try {
            b = 2;
        } catch (c) {
            var c;
        }
    })(3);
}while (0)
console.log(a);
