!(function(o) {
    try {
        throw 0;
    } catch (o) {
        o = 123456789 / 0;
    }
    console.log(o);
})();
