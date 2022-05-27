var b = 1, a = 0;
new (function c() {
    this[b-- && c()] = 1;
    a += 1;
})();
console.log(a);
