"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _object_without_properties = require("@swc/helpers/_/_object_without_properties");
// single line comment
const x = (_0)=>/*todo: refactor any type*/ {
    let { y } = _0, rest = _object_without_properties._(_0, [
        "y"
    ]);
    return {
        y,
        // another comment
        z: rest.z
    };
}; // final comment
