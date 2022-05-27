var a = 0;
new (function() {
    this[a++] = 1;
    a += 1;
})();
console.log(a);
