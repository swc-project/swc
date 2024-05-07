// single line comment
var _object_without_properties = require("@swc/helpers/_/_object_without_properties");
const x = (_param)=>/*todo: refactor any type*/ {
    var { y } = _param, rest = _object_without_properties._(_param, [
        "y"
    ]);
    return {
        y,
        // another comment
        z: rest.z
    };
}; // final comment
