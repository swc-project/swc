var a = 0, n = 1;
var a = n++, n = +(function() {})();
a && a[a++];
console.log(a, n);
