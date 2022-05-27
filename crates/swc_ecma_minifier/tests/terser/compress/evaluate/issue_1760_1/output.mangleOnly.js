!(function(a) {
    try {
        throw 0;
    } catch (b) {
        a = +"foo";
    }
    console.log(a);
})();
