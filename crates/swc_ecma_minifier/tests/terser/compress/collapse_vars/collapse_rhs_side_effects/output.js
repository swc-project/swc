var a = 1,
    c = 0;
new (function f() {
    this[a-- && f()] = 1;
    c += 1;
})();
console.log(c);
