var c = (function (a, b) {
    a = 0;
    b && b(a);
    return a++;
})();
console.log(c);
