var c = 0;
new (function () {
    this[c++] = 1;
    c += 1;
})();
console.log(c);
