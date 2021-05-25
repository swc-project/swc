var a = 8;
(function (b) {
    b.toString();
})(--a, (a |= 10));
console.log(a);
