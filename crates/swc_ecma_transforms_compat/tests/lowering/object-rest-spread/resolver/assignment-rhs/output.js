var _ref, _ref1, _ref2;
let source = [
    1,
    2
];
let tail;
const original = source;
const result = (_ref = source, [..._ref1] = _ref, { 0: source } = _ref1, tail = _object_without_properties(_ref1, [
    "0"
]), _ref);
console.log(result === original, source, tail);
let object = {
    first: 1,
    second: 2
};
const objectResult = (_ref2 = object, { first: object } = _ref2, tail = _object_without_properties(_ref2, [
    "first"
]), _ref2);
console.log(objectResult, object, tail);
