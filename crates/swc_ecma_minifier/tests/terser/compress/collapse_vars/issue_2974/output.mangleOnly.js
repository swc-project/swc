var a = 0;
(function b(c) {
    var d = 2;
    do {
        c && c[c];
        c && (c.null = -4);
        a++;
    }while (c.null && --d > 0)
})(true);
console.log(a);
