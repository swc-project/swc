var a = 8;
(function (b, c) {
    b.toString();
})(--a, (a |= 10));
console.log(a);
