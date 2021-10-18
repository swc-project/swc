function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
// error
fs2.apply(void 0, [
    'a'
].concat(_toConsumableArray(s2))); // error on ...s2
fs2.apply(void 0, [
    'a',
    'b',
    'c'
].concat(_toConsumableArray(s2))); // error on 'c' and ...s2
fs2.apply(void 0, [
    'a',
    'b'
].concat(_toConsumableArray(s2), [
    'c'
])); // error on ...s2 and 'c'
fs2.apply(void 0, [
    'a',
    'b',
    'c'
].concat(_toConsumableArray(s2), [
    'd'
])); // error on 'c', ...s2 and 'd'
fs2.apply(void 0, _toConsumableArray(s2).concat([
    'a'
])); // error on 'a'
fs2.apply(void 0, _toConsumableArray(s3)); // error on ...s3
fs2_.apply(void 0, _toConsumableArray(s_)); // error on ...s_
fs2_.apply(void 0, _toConsumableArray(s2n_)); // error on ...s2n_
fs2_.apply(void 0, _toConsumableArray(s_).concat(_toConsumableArray(s_))); // error         FIXME: bad error message
fs2_.apply(void 0, _toConsumableArray(s_).concat(_toConsumableArray(s_), _toConsumableArray(s_))); // error  FIXME: worse error message
// fs2n_(...s2, ...s_); //           FIXME: should be a type error
fs2n_.apply(void 0, _toConsumableArray(s2_)); // error on ...s2_
// ok
fs2_.apply(void 0, _toConsumableArray(s2_));
fs2_.apply(void 0, _toConsumableArray(s2_).concat(_toConsumableArray(s_)));
fs2_.apply(void 0, _toConsumableArray(s2_).concat(_toConsumableArray(s2_)));
fs2_.apply(void 0, _toConsumableArray(s_).concat(_toConsumableArray(s2_)));
fs2n_.apply(void 0, _toConsumableArray(s2n_));
fs2n_.apply(void 0, _toConsumableArray(s2));
// fs2n_(...s2, ...n_); // FIXME: should compile
fs5.apply(void 0, _toConsumableArray(s2).concat([
    "foo"
], _toConsumableArray(s2)));
