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
f10(42, "hello");
f10(42, "hello", true);
f10(42, "hello", true, false);
f10(t1[0], t1[1], t1[2], t1[3]);
f10.apply(void 0, _toConsumableArray(t1));
f10.apply(void 0, [
    42
].concat(_toConsumableArray(t2)));
f10.apply(void 0, [
    42,
    "hello"
].concat(_toConsumableArray(t3)));
f10.apply(void 0, [
    42,
    "hello",
    true
].concat(_toConsumableArray(t4)));
f10.apply(void 0, [
    42,
    "hello",
    true
].concat(_toConsumableArray(t4), [
    false
], _toConsumableArray(t3)));
f11(42, "hello");
f11(42, "hello", true);
f11(42, "hello", true, false);
f11(t1[0], t1[1], t1[2], t1[3]);
f11.apply(void 0, _toConsumableArray(t1));
f11.apply(void 0, [
    42
].concat(_toConsumableArray(t2)));
f11.apply(void 0, [
    42,
    "hello"
].concat(_toConsumableArray(t3)));
f11.apply(void 0, [
    42,
    "hello",
    true
].concat(_toConsumableArray(t4)));
f11.apply(void 0, [
    42,
    "hello",
    true
].concat(_toConsumableArray(t4), [
    false
], _toConsumableArray(t3)));
f12(42, "hello");
f12(42, "hello", true);
f12(42, "hello", true, false);
f12(t1[0], t1[1], t1[2], t1[3]);
f12.apply(void 0, _toConsumableArray(t1));
f12.apply(void 0, [
    42
].concat(_toConsumableArray(t2)));
f12.apply(void 0, [
    42,
    "hello"
].concat(_toConsumableArray(t3)));
f12.apply(void 0, [
    42,
    "hello",
    true
].concat(_toConsumableArray(t4)));
f12.apply(void 0, [
    42,
    "hello",
    true
].concat(_toConsumableArray(t4), [
    false
], _toConsumableArray(t3)));
f13(42, "hello");
f13(42, "hello", true);
f13(42, "hello", true, false);
f13(t1[0], t1[1], t1[2], t1[3]);
f13.apply(void 0, _toConsumableArray(t1));
f13.apply(void 0, [
    42
].concat(_toConsumableArray(t2)));
f13.apply(void 0, [
    42,
    "hello"
].concat(_toConsumableArray(t3)));
f13.apply(void 0, [
    42,
    "hello",
    true
].concat(_toConsumableArray(t4)));
f13.apply(void 0, [
    42,
    "hello",
    true
].concat(_toConsumableArray(t4), [
    false
], _toConsumableArray(t3)));
f20.apply(void 0, _toConsumableArray(t1));
f20.apply(void 0, [
    42
].concat(_toConsumableArray(t2)));
f20.apply(void 0, [
    42,
    "hello"
].concat(_toConsumableArray(t3)));
f20.apply(void 0, [
    42,
    "hello"
].concat(_toConsumableArray(t2), [
    true
]));
