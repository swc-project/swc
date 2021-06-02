module.exports = (function (constructor) {
    return constructor();
})(function () {
    return function (input) {
        var keyToMap = input.key;
        return {
            mappedKey: (function (value) {
                return value || "CONDITIONAL_DEFAULT_VALUE";
            })(keyToMap),
        };
    };
});
