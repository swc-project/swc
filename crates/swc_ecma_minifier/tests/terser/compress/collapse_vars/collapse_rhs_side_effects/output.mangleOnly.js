var n = 1, o = 0;
new (function o() {
    this[n-- && o()] = 1;
    o += 1;
})();
console.log(o);
