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
const { foo: { bar: { baz: { a: { x } } } } } = test, other = _object_without_properties(test.foo.bar.baz.a, [
    "x"
]);
