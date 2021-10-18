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
prefix.apply // required parameters are required
(void 0, _toConsumableArray(ns));
prefix.apply(void 0, _toConsumableArray(mixed));
prefix.apply(void 0, _toConsumableArray(tuple));
prefix2.apply(void 0, [
    "g"
].concat(_toConsumableArray(ns)));
