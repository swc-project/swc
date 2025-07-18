var _object_without_properties = require("@swc/helpers/_/_object_without_properties");
for(var _ref in function() {
    var property = foo.property, rest = _object_without_properties._(foo, [
        "property"
    ]);
    return rest;
}()){
    var value = _ref;
    console.log(value);
}
