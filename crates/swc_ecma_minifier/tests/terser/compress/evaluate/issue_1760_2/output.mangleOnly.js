!(function(a) {
    try {
        throw 0;
    } catch (b) {
        a = 123456789 / 0;
    }
    console.log(a);
})();
