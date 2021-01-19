var a = 100,
    b = 10;
(function (r, a) {
    switch (~a) {
        case (b += a):
        case a++:
    }
})(--b, a);
console.log(a, b);
