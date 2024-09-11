!(function(c) {
    try {
        throw 0;
    } catch (o) {
        c = 123456789 / 0;
    }
    console.log(c);
})();
