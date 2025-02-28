var o = 1, n = 0;
new (function c() {
    this[o-- && c()] = 1;
    n += 1;
})();
console.log(n);
