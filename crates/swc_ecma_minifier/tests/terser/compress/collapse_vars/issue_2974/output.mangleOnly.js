var a = 0;
(function d(b) {
    var c = 2;
    do {
        b && b[b];
        b && (b.null = -4);
        a++;
    }while (b.null && --c > 0)
})(true);
console.log(a);
