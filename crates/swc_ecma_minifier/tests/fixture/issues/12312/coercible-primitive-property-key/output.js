const object = {
    NaN: "NaN",
    Infinity: "Infinity",
    "-Infinity": "-Infinity",
    true: "true",
    false: "false",
    null: "null",
    undefined: "undefined",
    e: "mangled"
};
console.log(object[0 / 0], object[1 / 0], object[-1 / 0], object[true], object[false], object[null], object[void 0], object[0 / 0], object.e);
