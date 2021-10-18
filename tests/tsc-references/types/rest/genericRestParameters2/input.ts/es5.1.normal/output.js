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
