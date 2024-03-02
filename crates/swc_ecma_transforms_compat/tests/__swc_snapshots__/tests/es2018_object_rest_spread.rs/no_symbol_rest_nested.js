let { a, nested: { b, c }, e } = obj, d = _object_without_properties_loose(obj.nested, [
    "b",
    "c"
]);
