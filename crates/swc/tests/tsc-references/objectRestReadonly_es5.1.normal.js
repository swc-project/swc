import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
var obj = {
    foo: "bar",
    baz: "qux",
    quux: "quuz"
};
var foo = obj.foo, rest = _object_without_properties(obj, [
    "foo"
]);
delete rest.baz;
