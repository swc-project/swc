!(function(c) {
    try {
        throw 0;
    } catch (n) {
        c = 123456789 / 0;
    }
    console.log(c);
})();
