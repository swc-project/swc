const test = {
    foo: {
        bar: {
            baz: {
                a: {
                    x: 1,
                    y: 2,
                    z: 3
                }
            }
        }
    }
};
const { foo: { bar: { baz: { a: _ref } } } } = test, { x } = _ref, other = _object_without_properties(_ref, [
    "x"
]);
