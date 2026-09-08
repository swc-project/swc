globalThis.values = [
    NaN,
    Infinity,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    0 / 0,
    1 / 0,
    -1 / 0,
    1 / -0,
    Infinity / Infinity,
    1 % 0,
];

globalThis.notNaN = !NaN;
if (NaN) {
    globalThis.directNaN = "truthy";
} else {
    globalThis.directNaN = "falsy";
}
globalThis.nanSubtraction = NaN - 1 ? "truthy" : "falsy";
globalThis.nanDivision = Infinity / Infinity ? "truthy" : "falsy";
globalThis.joined = [Infinity, "" + globalThis.value].join("");

switch (1 / 0) {
    case 1 / 0:
        globalThis.matched = true;
        break;
    default:
        globalThis.matched = false;
}
