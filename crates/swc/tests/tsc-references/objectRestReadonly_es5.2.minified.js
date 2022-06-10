import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
var obj = {
    foo: "bar",
    baz: "qux",
    quux: "quuz"
};
obj.foo, delete _object_without_properties(obj, [
    "foo"
]).baz;
