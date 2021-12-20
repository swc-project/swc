function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
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
