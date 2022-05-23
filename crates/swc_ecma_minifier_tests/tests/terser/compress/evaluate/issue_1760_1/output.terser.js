!(function (a) {
    try {
        throw 0;
    } catch (NaN) {
        a = 0 / 0;
    }
    console.log(a);
})();
