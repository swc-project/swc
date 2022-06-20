"use strict";
var _objectWithoutPropertiesMjs = require("@swc/helpers/lib/_object_without_properties.js");
// single line comment
const x = (_param)=>/*todo: refactor any type*/ {
    var { y  } = _param, rest = (0, _objectWithoutPropertiesMjs.default)(_param, [
        "y"
    ]);
    return {
        y,
        // another comment
        z: rest.z
    };
}; // final comment
