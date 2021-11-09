function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}
function foo1(param) {
    var ref = _toArray(param === void 0 ? null : param), r = ref.slice(0);
}
function foo2(param) {
    var ref = _toArray(param === void 0 ? undefined : param), r = ref.slice(0);
}
function foo3(param) {
    var ref = _toArray(param === void 0 ? {
    } : param), r = ref.slice(0);
}
function foo4(param) {
    var ref = _toArray(param === void 0 ? [] : param), r = ref.slice(0);
}
