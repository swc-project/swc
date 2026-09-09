const object = {
    "NaN": "NaN",
    "Infinity": "Infinity",
    "-Infinity": "-Infinity",
    "true": "true",
    "false": "false",
    "null": "null",
    "undefined": "undefined",
    longprop: "mangled"
};

console.log(
    object[NaN],
    object[Infinity],
    object[-Infinity],
    object[true],
    object[false],
    object[null],
    object[void 0],
    object[+(void 0)],
    object.longprop
);
