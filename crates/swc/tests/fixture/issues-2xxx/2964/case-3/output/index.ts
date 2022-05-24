"use strict";
var _object_without_properties = require("@swc/helpers/lib/_object_without_properties.js").default;
// single line comment
const x = (_param)=>/*todo: refactor any type*/ {
    var { y  } = _param, rest = _object_without_properties(_param, [
        "y"
    ]);
    return {
        y,
        // another comment
        z: rest.z
    };
}; // final comment
