var x = 3, a = 1, b = 2;
(function() {
    while(--x >= 0 && void (a++, b += a));
})();
console.log(a);
