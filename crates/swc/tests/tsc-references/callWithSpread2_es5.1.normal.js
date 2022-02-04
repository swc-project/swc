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
// good
all.apply(void 0, _toConsumableArray(ns));
weird.apply(void 0, _toConsumableArray(ns));
weird.apply(void 0, _toConsumableArray(mixed));
weird.apply(void 0, _toConsumableArray(tuple));
prefix.apply(void 0, [
    "a"
].concat(_toConsumableArray(ns)));
rest.apply(void 0, [
    "d"
].concat(_toConsumableArray(ns)));
// extra arguments
normal.apply(void 0, [
    "g"
].concat(_toConsumableArray(ns)));
thunk.apply(void 0, _toConsumableArray(ns));
// bad
all.apply(void 0, _toConsumableArray(mixed));
all.apply(void 0, _toConsumableArray(tuple));
prefix.apply(void 0, [
    "b"
].concat(_toConsumableArray(mixed)));
prefix.apply(void 0, [
    "c"
].concat(_toConsumableArray(tuple)));
rest.apply(void 0, [
    "e"
].concat(_toConsumableArray(mixed)));
rest.apply(void 0, [
    "f"
].concat(_toConsumableArray(tuple)));
prefix.apply(void 0, _toConsumableArray(ns)) // required parameters are required
;
prefix.apply(void 0, _toConsumableArray(mixed));
prefix.apply(void 0, _toConsumableArray(tuple));
prefix2.apply(void 0, [
    "g"
].concat(_toConsumableArray(ns)));
