module.exports = function(constructor) {
    return constructor();
}(function() {
    return function(input) {
        return {
            mappedKey: input.key || "CONDITIONAL_DEFAULT_VALUE"
        };
    };
});
