var a, b = 1;
a = --b + (function a() {
    var b;
    a[--b] = 1;
})();
b |= a;
console.log(a, b);
