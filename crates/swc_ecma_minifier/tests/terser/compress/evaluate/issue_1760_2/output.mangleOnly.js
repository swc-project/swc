!(function(t) {
    try {
        throw 0;
    } catch (c) {
        t = 123456789 / 0;
    }
    console.log(t);
})();
