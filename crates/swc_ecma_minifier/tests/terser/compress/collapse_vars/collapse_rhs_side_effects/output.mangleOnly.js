var n = 1,
    o = 0;
new (function c() {
    this[n-- && c()] = 1;
    o += 1;
})();
console.log(o);
