// Run this script to build jsprops.json

const fs = require("fs");

// Compatibility fix for some standard defined globals not defined on every js environment
var new_globals = [
    "Symbol",
    "Map",
    "Promise",
    "Proxy",
    "Reflect",
    "Set",
    "WeakMap",
    "WeakSet",
];
var objects = {};
var global_ref = typeof global === "object" ? global : self;

new_globals.forEach(function (new_global) {
    objects[new_global] = global_ref[new_global] || new Function();
});

const addedProps = new Set();

const add = (propName) => addedProps.add(propName);

["null", "true", "false", "NaN", "Infinity", "-Infinity", "undefined"].forEach(
    add
);
[
    Object,
    Array,
    Function,
    Number,
    String,
    Boolean,
    Error,
    Math,
    Date,
    RegExp,
    objects.Symbol,
    ArrayBuffer,
    DataView,
    decodeURI,
    decodeURIComponent,
    encodeURI,
    encodeURIComponent,
    eval,
    EvalError,
    Float32Array,
    Float64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    isFinite,
    isNaN,
    JSON,
    objects.Map,
    parseFloat,
    parseInt,
    objects.Promise,
    objects.Proxy,
    RangeError,
    ReferenceError,
    objects.Reflect,
    objects.Set,
    SyntaxError,
    TypeError,
    Uint8Array,
    Uint8ClampedArray,
    Uint16Array,
    Uint32Array,
    URIError,
    objects.WeakMap,
    objects.WeakSet,
].forEach((ctor) => {
    Object.getOwnPropertyNames(ctor).map(add);
    if (ctor.prototype) {
        Object.getOwnPropertyNames(ctor.prototype).map(add);
    }
});

const propsJSON = JSON.stringify([...addedProps].sort(), null, 4);

fs.writeFileSync(__dirname + "/../src/lists/jsprops.json", propsJSON);
