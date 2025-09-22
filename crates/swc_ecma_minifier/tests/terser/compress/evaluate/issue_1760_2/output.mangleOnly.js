!(function(n) {
    try {
        throw 0;
    } catch (o) {
        n = 123456789 / 0;
    }
    console.log(n);
})();
