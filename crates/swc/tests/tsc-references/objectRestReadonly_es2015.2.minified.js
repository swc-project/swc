import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
let obj = {
    foo: 'bar',
    baz: 'qux',
    quux: 'quuz'
}, { foo  } = obj, rest = _object_without_properties(obj, [
    "foo"
]);
delete rest.baz;
