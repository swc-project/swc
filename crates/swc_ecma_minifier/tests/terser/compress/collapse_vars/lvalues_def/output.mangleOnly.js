var a = 0, b = 1;
var a = b++, b = +(function() {})();
a && a[a++];
console.log(a, b);
