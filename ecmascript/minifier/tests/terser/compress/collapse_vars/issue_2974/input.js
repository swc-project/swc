var c = 0;
(function f(b) {
    var a = 2;
    do {
        b && b[b];
        b && (b.null = -4);
        c++;
    } while (b.null && --a > 0);
})(true);
console.log(c);
