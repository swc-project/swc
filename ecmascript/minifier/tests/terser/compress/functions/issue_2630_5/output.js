var c = 1;
!(function () {
    do {
        c *= 10;
    } while ((c = 2 + (c += 3)) < 100);
})();
console.log(c);
