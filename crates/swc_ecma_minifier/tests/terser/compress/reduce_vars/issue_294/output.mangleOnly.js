module.exports = (function(a) {
    return a();
})(function() {
    return function(a) {
        var b = a.key;
        return {
            mappedKey: (function(a) {
                return a || "CONDITIONAL_DEFAULT_VALUE";
            })(b)
        };
    };
});
