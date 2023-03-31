// single line comment
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _object_without_properties = require("@swc/helpers/lib/_object_without_properties.js").default;
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
