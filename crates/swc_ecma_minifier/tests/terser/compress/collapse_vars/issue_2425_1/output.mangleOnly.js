var n = 8;
(function(n) {
    n.toString();
})(--n, (n |= 10));
console.log(n);
