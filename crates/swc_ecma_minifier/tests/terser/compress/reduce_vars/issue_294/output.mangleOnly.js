module.exports = (function (n) {
    return n();
})(function () {
    return function (n) {
        var r = n.key;
        return {
            mappedKey: (function (n) {
                return n || "CONDITIONAL_DEFAULT_VALUE";
            })(r),
        };
    };
});
