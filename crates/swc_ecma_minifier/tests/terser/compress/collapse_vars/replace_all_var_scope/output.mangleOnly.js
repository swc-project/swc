var c = 100,
    o = 10;
(function (c, s) {
    switch (~s) {
        case (o += s):
        case s++:
    }
})(--o, c);
console.log(c, o);
