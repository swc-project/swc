const defunct = {
    outer: {
        inner: {
            three: 'three',
            four: 'four'
        }
    }
};
const { outer: { inner: _ref } } = defunct, { three } = _ref, other = _object_without_properties(_ref, [
    "three"
]);
