import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
var obj = {
    foo: "bar",
    baz: "qux",
    quux: "quuz"
};
obj.foo, delete _object_without_properties(obj, [
    "foo"
]).baz;
