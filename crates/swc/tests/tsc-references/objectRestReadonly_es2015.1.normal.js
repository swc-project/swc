import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
const obj = {
    foo: 'bar',
    baz: 'qux',
    quux: 'quuz'
};
const { foo  } = obj, rest = _object_without_properties(obj, [
    "foo"
]);
delete rest.baz;
