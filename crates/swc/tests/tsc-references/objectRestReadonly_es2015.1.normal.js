import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
const obj = {
    foo: 'bar',
    baz: 'qux',
    quux: 'quuz'
};
const { foo  } = obj, rest = _object_without_properties(obj, [
    "foo"
]);
delete rest.baz;
