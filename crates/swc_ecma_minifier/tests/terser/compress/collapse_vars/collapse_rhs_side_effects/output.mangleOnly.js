var a = 1, b = 0;
new (function c() {
    this[a-- && c()] = 1;
    b += 1;
})();
console.log(b);
