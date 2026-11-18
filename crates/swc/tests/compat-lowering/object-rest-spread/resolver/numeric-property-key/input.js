const source = {
    "Infinity": "excluded infinity",
    "1e+21": "excluded finite",
    keep: "kept",
};

const {
    1e999: excludedInfinity,
    1e21: excludedFinite,
    ...rest
} = source;
