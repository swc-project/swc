const stringKeys = [
    ({ Infinity: "wrong", inf: "correct" })["inf"],
    ({ "-Infinity": "wrong", "-inf": "correct" })["-inf"],
    ({ 0: "wrong", "-0": "correct" })["-0"],
    ({ 1: "wrong", "01": "correct" })["01"],
    ({ 1: "wrong", "+1": "correct" })["+1"],
    ({ 1: "wrong", "1.0": "correct" })["1.0"],
    ({ 1e21: "wrong", "1000000000000000000000": "correct" })[
        "1000000000000000000000"
    ],
];

const numberKeys = [
    ({ Infinity: "correct" })[1e999],
    ({ "-Infinity": "correct" })[-1e999],
    ({ 0: "correct" })[-0],
    ({ 1e21: "correct" })[1e21],
];

const canonicalArrayIndex = ["zero", "correct"]["1"];
const nonCanonicalArrayIndex = ["zero", "wrong"]["01"];
const canonicalStringIndex = "correct"["0"];
const nonCanonicalStringIndex = "wrong"["01"];
const numericNonLiteralObject = ({ 1: value })[1];
const stringNonLiteralObject = ({ key: value })["key"];
