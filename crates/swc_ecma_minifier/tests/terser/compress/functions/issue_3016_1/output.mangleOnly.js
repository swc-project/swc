var a = 1;
do {
    (function(b) {
        return b[a];
        var b;
    })(3);
}while (0)
console.log(a);
