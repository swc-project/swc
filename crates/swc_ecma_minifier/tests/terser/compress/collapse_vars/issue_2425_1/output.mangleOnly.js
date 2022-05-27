var a = 8;
(function(a) {
    a.toString();
})(--a, (a |= 10));
console.log(a);
