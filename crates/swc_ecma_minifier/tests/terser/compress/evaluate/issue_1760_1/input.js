!(function (a) {
    try {
        throw 0;
    } catch (NaN) {
        a = +"foo";
    }
    console.log(a);
})();
