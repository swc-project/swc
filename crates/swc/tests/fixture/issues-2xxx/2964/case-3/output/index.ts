"use strict";
const _objectWithoutProperties = require("@swc/helpers/lib/_object_without_properties.js").default;
// single line comment
const x = (_param)=>/*todo: refactor any type*/ {
    var { y  } = _param, rest = _objectWithoutProperties(_param, [
        "y"
    ]);
    return {
        y,
        // another comment
        z: rest.z
    };
}; // final comment
