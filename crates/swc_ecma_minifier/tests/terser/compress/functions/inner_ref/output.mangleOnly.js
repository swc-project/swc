console.log((function(n) {
    return (function() {
        return n + 1;
    })();
})(1), (function(n) {
    return (function(n) {
        return n === undefined;
    })();
})(2));
