const defunct = {
    outer: {
        inner: {
            three: 'three',
            four: 'four'
        }
    }
};
const { outer: { inner: { three } } } = defunct, other = _object_without_properties(defunct.outer.inner, [
    "three"
]);
