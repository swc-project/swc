module.exports = function (input) {
    var value;
    return {
        mappedKey: ((value = input.key), value || "CONDITIONAL_DEFAULT_VALUE"),
    };
};
