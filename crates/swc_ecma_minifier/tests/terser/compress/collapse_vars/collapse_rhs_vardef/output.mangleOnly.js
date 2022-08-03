var a, n = 1;
a = --n + (function a() {
    var n;
    a[--n] = 1;
})();
n |= a;
console.log(a, n);
