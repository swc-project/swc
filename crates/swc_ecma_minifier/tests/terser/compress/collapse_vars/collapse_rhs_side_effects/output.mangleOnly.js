var n = 1, _ = 0;
new (function i() {
    this[n-- && i()] = 1;
    _ += 1;
})();
console.log(_);
