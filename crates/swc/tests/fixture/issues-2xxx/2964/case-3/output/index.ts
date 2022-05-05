"use strict";
var swcHelpers = require("@swc/helpers");
// single line comment
const x = (_param)=>/*todo: refactor any type*/ {
    var { y  } = _param, rest = swcHelpers.objectWithoutProperties(_param, [
        "y"
    ]);
    return {
        y,
        // another comment
        z: rest.z
    };
}; // final comment
