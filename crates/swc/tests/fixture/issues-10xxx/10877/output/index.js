import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
for(var value in function() {
    var property = foo.property, rest = _object_without_properties(foo, [
        "property"
    ]);
    return rest;
}()){
    console.log(value);
}
