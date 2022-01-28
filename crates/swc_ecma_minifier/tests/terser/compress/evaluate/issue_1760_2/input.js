!(function (a) {
    try {
        throw 0;
    } catch (Infinity) {
        a = 123456789 / 0;
    }
    console.log(a);
})();
