const defunct = {
    outer: {
        inner: {
            three: 'three',
            four: 'four'
        }
    }
};
const { outer: _ref } = defunct, { inner: _ref1 } = _ref, { three } = _ref1, other = _object_without_properties(_ref1, [
    "three"
]);
