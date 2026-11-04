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
const { foo: _ref } = test, { bar: _ref1 } = _ref, { baz: _ref2 } = _ref1, { a: _ref3 } = _ref2, { x } = _ref3, other = _object_without_properties(_ref3, [
    "x"
]);
