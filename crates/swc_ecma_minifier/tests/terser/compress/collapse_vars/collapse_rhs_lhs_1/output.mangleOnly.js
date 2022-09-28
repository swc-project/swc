var n = 0;
new (function() {
    this[n++] = 1;
    n += 1;
})();
console.log(n);
