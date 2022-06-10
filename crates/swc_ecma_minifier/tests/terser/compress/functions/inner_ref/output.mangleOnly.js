console.log((function(a) {
    return (function() {
        return a + 1;
    })();
})(1), (function(a) {
    return (function(a) {
        return a === undefined;
    })();
})(2));
