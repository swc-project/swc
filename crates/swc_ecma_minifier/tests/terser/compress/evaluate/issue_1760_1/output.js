!function(a) {
    try {
        throw 0;
    } catch (NaN) {
        a = NaN;
    }
    console.log(a);
}();
