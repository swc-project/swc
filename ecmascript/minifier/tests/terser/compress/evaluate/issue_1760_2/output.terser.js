!(function (a) {
    try {
        throw 0;
    } catch (Infinity) {
        a = 1 / 0;
    }
    console.log(a);
})();
