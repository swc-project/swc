const source = {
    "Infinity": "excluded infinity",
    "1e+21": "excluded finite",
    keep: "kept"
};
const { 1e999: excludedInfinity, 1e21: excludedFinite } = source, rest = _object_without_properties(source, [
    "Infinity",
    "1e+21"
]);
