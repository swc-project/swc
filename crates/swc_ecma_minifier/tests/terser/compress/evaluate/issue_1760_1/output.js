!function(a) {
    try {
        throw 0;
    } catch (NaN1) {
        a = NaN;
    }
    console.log(a);
}();
