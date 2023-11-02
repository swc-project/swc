!(function(o) {
    try {
        throw 0;
    } catch (Infinity) {
        o = 123456789 / 0;
    }
    console.log(o);
})();
