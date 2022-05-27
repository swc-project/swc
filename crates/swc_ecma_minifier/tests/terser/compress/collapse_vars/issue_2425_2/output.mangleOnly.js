var a = 8;
(function(a, b) {
    a.toString();
})(--a, (a |= 10));
console.log(a);
